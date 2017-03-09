/**
 * Query Actions module.
 * A collection of reusable action thunks 
 * that unify query calls handling,
 * regarding loading state and errors.
 * 
 * @module QueryActions
 */

const types = require('../constants/ActionTypes');
const { CACHE_SIZE, SUCCESS_SHOW_TIMEOUT, SHOWERS_PAGE } = require('../constants/HomeConstants');

const deviceAPI = require('../api/device');
const meterAPI = require('../api/meter');
const dataAPI = require('../api/data');

const { updateOrAppendToSession, getShowerRange, filterShowers, getLastShowerIdFromMultiple, memberFilterToMembers } = require('../utils/sessions');
const { getDeviceKeysByType, filterDataByDeviceKeys } = require('../utils/device');
const { getCacheKey, throwServerError, showerFilterToLength, getShowersPagingIndex } = require('../utils/general');
const { getTimeByPeriod, getPreviousPeriodSoFar, getLowerGranularityPeriod, convertGranularityToPeriod } = require('../utils/time');


const requestedQuery = function () {
  return {
    type: types.QUERY_REQUEST_START,
  };
};

const receivedQuery = function (success, errors) {
  return {
    type: types.QUERY_REQUEST_END,
    success,
    errors,
  };
};

const resetSuccess = function () {
  return {
    type: types.QUERY_RESET_SUCCESS,
  };
};

const setError = function (error) {
  return {
    type: types.QUERY_SET_ERROR,
    error,
  };
};

 /**
 * Dismiss error after acknowledgement
 */
const dismissError = function () {
  return {
    type: types.QUERY_DISMISS_ERROR,
  };
};

const setInfo = function (info) {
  return {
    type: types.QUERY_SET_INFO,
    info,
  };
};

 /**
 * Dismiss info after acknowledgement
 */
const dismissInfo = function () {
  return {
    type: types.QUERY_DISMISS_INFO,
  };
};

const cacheItemRequested = function (cacheKey) {
  return {
    type: types.QUERY_CACHE_ITEM_REQUESTED,
    key: cacheKey,
  };
};

const setCache = function (cache) {
  return {
    type: types.QUERY_SET_CACHE,
    cache,
  };
};

const saveToCache = function (cacheKey, data) {
  return function (dispatch, getState) {
    const { cache } = getState().query;
    if (Object.keys(cache).length >= CACHE_SIZE) {
      console.warn('Cache limit exceeded, making space by emptying LRU...');
      
      const newCacheKeys = Object.keys(cache)
      .sort((a, b) => cache[b].counter - cache[a].counter)
      .filter((x, i) => i < Object.keys(cache).length - 1);

      const newCache = {};
      newCacheKeys.forEach((key) => {
        newCache[key] = cache[key];
      });
      
      dispatch(setCache(newCache));
    }
    dispatch({
      type: types.QUERY_SAVE_TO_CACHE,
      key: cacheKey,
      data,
    });
  };
};

/**
 * Query Device sessions
 * @param {Object} options - Query options
 * @param {Array} options.deviceKey - Array of device keys to query
 * @param {String} options.type - The query type. One of SLIDING, ABSOLUTE
 * @param {Number} options.startIndex - Start index for ABSOLUTE query
 * @param {Number} options.endIndex - End index for ABSOLUTE query
 * @param {Number} options.length - Length for SLIDING query
 * @return {Promise} Resolve returns Object containing device sessions data 
 * in form {data: sessionsData}, reject returns possible errors
 * 
 */
const queryDeviceSessions = function (options) {
  return function (dispatch, getState) {
    const { length, deviceKey, memberFilter } = options;
    
    if (!deviceKey || !length) {
      throw new Error(`Not sufficient data provided for device sessions query: deviceKey:${deviceKey}`);
    }
    
    const members = memberFilterToMembers(memberFilter);
    
    const data = {
      ...options,
      type: 'SLIDING', 
      members,
      csrf: getState().user.csrf,
    };
    
    dispatch(requestedQuery());

    return deviceAPI.querySessions(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors, response.devices));
      dispatch(resetSuccess());


      if (!response || !response.success) {
        throwServerError(response);  
      }
      
      // TODO: client-side filtering can lead to inaccuracies, should better be on backend
      return response.devices.map(session => ({ 
          ...session,
          sessions: session.sessions.filter(s => memberFilter === 'default' ? s.member === null : true),
          range: session.sessions ? getShowerRange(session.sessions) : {}
        }));
    })
    .catch((error) => {
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};
 
/**
 * Wrapper to queryDeviceSessions with cache functionality
 * @param {Object} options - The queryDeviceSessions options object
 * @return {Promise} Resolve returns Object containing device sessions 
 * data in form {data: sessionsData}, reject returns possible errors
 * 
 */

const queryDeviceSessionsCache = function (options) {
  return function (dispatch, getState) {
    const { length, deviceKey, type, memberFilter, index = 0 } = options;

    const cacheKey = getCacheKey('AMPHIRO', memberFilter, length, index);
    const startIndex = SHOWERS_PAGE * getShowersPagingIndex(length, index);

    // if item found in cache return it
    if (getState().query.cache[cacheKey]) {
      dispatch(cacheItemRequested(cacheKey));
      const cacheItem = getState().query.cache[cacheKey].data;
      const deviceData = filterDataByDeviceKeys(cacheItem, deviceKey);
      return Promise.resolve(filterShowers(deviceData, length, index));
    }
    
    const newOptions = {
      length: SHOWERS_PAGE,
      startIndex,
      memberFilter,
      deviceKey: getDeviceKeysByType(getState().user.profile.devices, 'AMPHIRO'),
    };
    
    return dispatch(queryDeviceSessions(newOptions))
    .then((devices) => {
      dispatch(saveToCache(cacheKey, devices));
      // return only the items requested
      const deviceData = filterDataByDeviceKeys(devices, deviceKey);
      return filterShowers(deviceData, length, index);
    });
  };
};
 
/**
 * Fetch specific device session
 * @param {String} deviceKey - Device keys to query
 * @param {Number} options - Session id to query
 * @return {Promise} Resolve returns Object containing device session data, 
 *  reject returns possible errors
 * 
 */
const fetchDeviceSession = function (id, deviceKey) {
  return function (dispatch, getState) {
    if (!id || !deviceKey) {
      throw new Error(`Not sufficient data provided for device session fetch: id: ${id}, deviceKey:${deviceKey}`);
    }

    dispatch(requestedQuery());

    const data = {
      sessionId: id, 
      deviceKey,
      csrf: getState().user.csrf,
    };

    return deviceAPI.getSession(data)
      .then((response) => {
        dispatch(receivedQuery(response.success, response.errors, response.session));
        dispatch(resetSuccess());
        
        if (!response || !response.success) {
          throwServerError(response);  
        }
        return response.session;
      })
      .catch((errors) => {
        dispatch(receivedQuery(false, errors));
        throw errors;
      });
  };
};

/**
 * Fetch last session for array of devices
 * @param {String} deviceKey - Device keys to query
 * @return {Promise} Resolve returns Object containing last session data 
 * for all devices provided (last session between devices is computed using timestamp), 
 * reject returns possible errors
 * 
 */
const fetchLastDeviceSession = function (options) {
  return function (dispatch, getState) {
    const { cache } = options;
    let querySessions = null;
    if (cache) {
      querySessions = queryDeviceSessionsCache;
    } else {
      querySessions = queryDeviceSessions;
    }
    return dispatch(querySessions({ ...options, length: 1 }))
    .then((response) => {
      const reduced = response.reduce((p, c) => [...p, ...c.sessions.map(s => ({ ...s, device: c.deviceKey }))], []);
      // find last
      const lastSession = reduced.reduce((curr, prev) => 
        ((curr.timestamp > prev.timestamp) ? curr : prev), {}); 

      const { device, id, index, timestamp } = lastSession;

      if (!id) throw new Error('sessionIDNotFound');
      const devSessions = response.find(x => x.deviceKey === device);

      return dispatch(fetchDeviceSession(id, device))
      .then(session => ({ 
        ...session,
        showerId: id,
        device,
        data: updateOrAppendToSession([devSessions], { ...session, deviceKey: device }), 
        }))
      .catch((error) => { throw error; });
    });
  };
};

/**
 * Query Meter for historic session data
 * @param {Object} options - Query options
 * @param {Array} options.deviceKey - Array of device keys to query
 * @param {Object} options.time - Query time window
 * @param {Number} options.time.startDate - Start timestamp for query
 * @param {Number} options.time.endDate - End timestamp for query
 * @param {Number} options.time.granularity - Granularity for data aggregation. 
 *  One of 0: minute, 1: hour, 2: day, 3: week, 4: month
 * @return {Promise} Resolve returns Object containing meter sessions data 
 *  in form {data: sessionsData}, reject returns possible errors
 * 
 */                 
const queryMeterHistory = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, time } = options;
    if (!deviceKey || !time || !time.startDate || !time.endDate) {
      throw new Error(`Not sufficient data provided for meter history query: deviceKey:${deviceKey}, time: ${time.startDate}, ${time.endDate}`);
    }

    dispatch(requestedQuery());
    
    const data = {
      ...time,
      ...options,
      csrf: getState().user.csrf,
    };
    return meterAPI.getHistory(data)
      .then((response) => {
        dispatch(receivedQuery(response.success, response.errors, response.session));
        dispatch(resetSuccess());
        
        if (!response || !response.success) {
          throwServerError(response);  
        }
        return response.series;
      })
      .catch((error) => {
        dispatch(receivedQuery(false, error));
        throw error;
      });
  };
};

/**
 * Wrapper to queryMeterHistory with cache functionality
 * @param {Object} options - The queryMeterHistory options object
 * @return {Promise} Resolve returns Object containing meter sessions data 
 * in form {data: sessionsData}, 
 * reject returns possible errors
 * 
 */
const queryMeterHistoryCache = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, time } = options;

    const cacheKey = getCacheKey('METER', time);

    if (getState().query.cache[cacheKey]) {
      dispatch(cacheItemRequested(cacheKey));
      const cacheItem = getState().query.cache[cacheKey].data;
      return Promise.resolve(filterDataByDeviceKeys(cacheItem, deviceKey));
    }
    // fetch all meters requested in order to save to cache 
    const newOptions = {
      ...options, 
      time, 
      deviceKey: getDeviceKeysByType(getState().user.profile.devices, 'METER'),
    }; 
    return dispatch(queryMeterHistory(newOptions))
    .then((series) => {
      dispatch(saveToCache(cacheKey, series));
      // return only the meters requested  
      return filterDataByDeviceKeys(series, deviceKey);
    });
  };
};

const queryMeterForecast = function (options) {
  return function (dispatch, getState) {
    const { time } = options;
    if (!time || !time.startDate || !time.endDate || time.granularity == null) {
      throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 
                      'time object with startDate, endDate and granularity');
    }
    dispatch(requestedQuery());
    
    const data = {
      query: {
        time: {
          type: 'ABSOLUTE',
          start: time.startDate,
          end: time.endDate,
          granularity: getLowerGranularityPeriod(
            convertGranularityToPeriod(time.granularity)
          ),
        },
        population: [{
          type: 'USER',
          users: [getState().user.profile.key],
        }],
      },
      csrf: getState().user.csrf,
    };

    return meterAPI.getForecast(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success || !Array.isArray(response.meters) || 
          !response.meters[0] || !response.meters[0].points) {
        throwServerError(response);  
      }
      return response.meters[0].points;
    })
    .catch((error) => {
      console.error('caught error in query meter forecast: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const queryData = function (options) {
  return function (dispatch, getState) {
    const { time, population, source, metrics } = options;
    /*
    if (!time || !time.startDate || !time.endDate || time.granularity == null 
        || !population || !source || !metrics) {
      throw new Error('Not sufficient data provided for data query. Requires: \n' + 
                      'time object with startDate, endDate and granularity,\n' +
                      'population,\n' +
                      'source,\n' +
                      'metrics\n'
                     );
                     }
    */
    dispatch(requestedQuery());
    
    const data = {
      query: {
        time: {
          type: 'ABSOLUTE',
          start: time.startDate,
          end: time.endDate,
          granularity: getLowerGranularityPeriod(
            convertGranularityToPeriod(time.granularity)
          ),
        },
        population, 
        source,
        metrics,
      },
      csrf: getState().user.csrf,
    };

    return dataAPI.query(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success) {
        throwServerError(response);  
      }

      return response;
    })
    .catch((error) => {
      console.error('caught error in data query: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const ignoreShower = function (options) {
  return function (dispatch, getState) {
    const data = {
      sessions: [{
        ...options,
        timestamp: new Date().valueOf(),
      }],
      csrf: getState().user.csrf,
    };  
    dispatch(requestedQuery());

    return dataAPI.ignoreShower(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);  
      }
      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on assign shower to member:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

/**
 * Fetch data based on provided options and handle query response before returning
 * 
 * @param {Object} options - Options to fetch data 
 * @param {Boolean} options.cache - Whether cache query functions should be called or not 
 * @param {String} options.deviceType - The type of device to query. One of METER, AMPHIRO
 * @param {String} options.period - The period to query.
 *                                  For METER one of day, week, month, year, custom (time-based)
 *                                  for AMPHIRO one of ten, twenty, fifty (index-based)
 * @param {String} options.type - The widget type. One of: 
 *                                total (total metric consumption for period and deviceType),
 *                                last (last shower - only for deviceType AMPHIRO),
 *                                efficiency (energy efficiency for period - 
 *                                  only for deviceType AMPHIRO, metric energy),
 *                                breakdown (Water breakdown analysis for period - 
 *                                  only for deviceType METER, metric difference 
 *                                  (volume difference). Static for the moment),
 *                                forecast (Computed forecasting for period 
 *                                - only for deviceType METER, 
 *                                  metric difference (volume difference). 
 *                                  Static for the moment),
 *                                comparison (Comparison for period and comparison metric 
 *                                - only for deviceType METER. Static for the moment),
 *                                budget (User budget information. Static for the moment)
 *
 */
const fetchWidgetData = function (options) {
  return function (dispatch, getState) {
    const { type, deviceType, period } = options;
    const cache = options.cache || true;
    const deviceKey = getDeviceKeysByType(getState().user.profile.devices, deviceType);
    
    if (!type || !deviceType || !deviceKey) {
      console.error('fetchWidgetData: Insufficient data provided (need type, deviceType, deviceKey):', options);
      throw new Error('fetchWidgetData: Insufficient data provided:');
    }

    let queryMeter;
    let queryDevice;
    if (cache) {
      queryMeter = queryMeterHistoryCache;
      queryDevice = queryDeviceSessionsCache;
    } else {
      queryMeter = queryMeterHistory;
      queryDevice = queryDeviceSessions;
    }

    // if no device in array just return 
    if (!deviceKey || !deviceKey.length) {
      return Promise.resolve(); 
    }
    const time = options.time ? options.time : getTimeByPeriod(period);

    if (deviceType === 'METER') {      
      const prevTime = getPreviousPeriodSoFar(period);
      return dispatch(queryMeter({ cache, deviceKey, time }))
      .then(data => ({ data }))
      .then((res) => {
        if (type === 'total' && prevTime) {
          // fetch previous period data for comparison 
          return dispatch(queryMeter({ cache, deviceKey, time: prevTime }))
          .then(prevData => ({ ...res, previous: prevData, prevTime }))
          .catch((error) => { 
            console.error('Caught error in widget previous period data fetch:', error); 
          });
        } else if (type === 'forecast') {
          return dispatch(queryMeterForecast({ time }))
          .then(forecastData => ({ ...res, forecastData }))
          .catch((error) => { 
            console.error('Caught error in widget forecast data fetch:', error); 
          });
        }
        return Promise.resolve(res);
      });
    } else if (deviceType === 'AMPHIRO') {
      //const amphiroCache = getState().query.cache[getCacheKey('AMPHIRO')];
      //const allShowers = amphiroCache ? amphiroCache.data : [];

      if (type === 'last') {
        return dispatch(fetchLastDeviceSession({ cache, deviceKey }));
      }
      return dispatch(queryDevice({ 
        cache, 
        length: showerFilterToLength(period),
        deviceKey,
      }))
      .then(data => ({ data }));
    }
    return Promise.reject(new Error('noDeviceType'));
  };
};

module.exports = {
  queryDeviceSessionsCache,
  queryDeviceSessions,
  fetchDeviceSession,
  fetchLastDeviceSession,
  queryMeterHistoryCache,
  queryMeterHistory,
  fetchWidgetData,
  dismissError,
  resetSuccess,
  setError,
  requestedQuery,
  receivedQuery,
  setInfo,
  dismissInfo,
  queryMeterForecast,
  queryData,
  ignoreShower,
};
