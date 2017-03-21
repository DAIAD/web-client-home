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
const { getCacheKey, throwServerError, showerFilterToLength, getShowersPagingIndex, filterCacheItems } = require('../utils/general');
const { getTimeByPeriod, getPreviousPeriodSoFar, getLowerGranularityPeriod, convertGranularityToPeriod } = require('../utils/time');
const moment = require('moment');

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

const clearCacheItems = function (deviceType, ...rest) {
  return function (dispatch, getState) {
    const { cache } = getState().query;
    dispatch(setCache(filterCacheItems(cache, deviceType, ...rest)));
  };
};

const saveToCache = function (cacheKey, data) {
  return function (dispatch, getState) {
    const { cache } = getState().query;
    if (!cacheKey) return;
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

const fetchFromCache = function (cacheKey) {
  return function (dispatch, getState) {
    if (getState().query.cache[cacheKey]) {
      dispatch(cacheItemRequested(cacheKey));
      const { data } = getState().query.cache[cacheKey];
      return Promise.resolve(data);
    }
    return Promise.reject('notFound');
  };
};

const queryData = function (options) {
  return function (dispatch, getState) {
    const { time, population, source, metrics } = options;
    
    const data = {
      query: {
        //datetime: 'Europe/Madrid',
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

    dispatch(requestedQuery());

    return dataAPI.query(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success) {
        throwServerError(response);  
      }
      const meters = response.meters || [];
      const devices = response.devices || [];
      return {
        ...response,
        meters: meters.map(m => ({ ...m, source: 'METER' })),
        devices: devices.map(d => ({ ...d, source: 'AMPHIRO' })),
      };
    })
    .catch((error) => {
      console.error('caught error in data query: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const queryDataCache = function (options) {
  return function (dispatch, getState) {
    const { time, length, index, population, source, metrics } = options;
    const { cache } = getState().query;
    
    const inCache = population.filter(group => cache[group.label] != null);
    const notInCache = population.filter(group => !inCache.includes(group));

    const inCachePromise = Promise.all(inCache.map(group => dispatch(fetchFromCache(group.label))));

    if (notInCache.length === 0) {
      return inCachePromise
      .then(inCacheData => ({
        devices: inCacheData.filter(d => d.source === 'AMPHIRO'),
        meters: inCacheData.filter(d => d.source === 'METER'),
      }));
    } 
    return dispatch(queryData({ ...options, population: notInCache }))
    .then((response) => {
      [...response.meters, ...response.devices].forEach((device) => {
        dispatch(saveToCache(device.label, device));
      });
      return inCachePromise.then(inCacheData => ({
          ...response,
          devices: [
            ...response.devices,
            ...inCacheData.filter(d => d.source === 'AMPHIRO'),
          ],
          meters: [
            ...response.meters,
            ...inCacheData.filter(d => d.source === 'METER'),
          ],
        }));
    });
  };
};

const queryDataAverageCache = function (options) {
  return function (dispatch, getState) {
    const { time, population, source } = options;
    return dispatch(queryDataCache({
      time,
      population,
      source,
      metrics: ['AVERAGE'],
    }))
    .then(response => source === 'METER' ? response.meters : response.devices)
    .then(sessions => sessions.map(session => session.points.map(p => ({ 
      ...p, 
      volume: p.volume.AVERAGE || p.volume.SUM, 
    }))));
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
      
      return response.devices.map(session => ({ 
          ...session,
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

    //const userKey = getState().user.profile.key;
    //const cacheKey = getCacheKey('AMPHIRO', userKey, length, index);
    const cacheKey = getCacheKey('AMPHIRO', memberFilter, length, index);
    const startIndex = SHOWERS_PAGE * getShowersPagingIndex(length, index);

    // if item found in cache return it
    return dispatch(fetchFromCache(cacheKey))
    .then((data) => {
      const deviceData = filterDataByDeviceKeys(data, deviceKey);
      return Promise.resolve(filterShowers(deviceData, length, index));
    })
    .catch((error) => {
      const newOptions = {
        ...options, 
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
    }); 
      /*
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
    */
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
    return dispatch(querySessions({ ...options, length: 10 }))
    .then((response) => {
      const reduced = response.reduce((p, c) => [...p, ...c.sessions.map(s => ({ ...s, device: c.deviceKey }))], []);
      // find last
      const lastSession = reduced.reduce((curr, prev) => 
        ((curr.id > prev.id) ? curr : prev), {}); 

      const { device, id, index, timestamp } = lastSession;

      if (!id) throw new Error('sessionIDNotFound');
      const devSessions = response.find(x => x.deviceKey === device);

      return dispatch(fetchDeviceSession(id, device))
      .then(session => ({ 
        ...session,
        active: [device, id],
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
    const { time } = options;
    
    if (!time || !time.startDate || !time.endDate) {
      throw new Error(`Not sufficient data provided for meter history query: time: ${time.startDate}, ${time.endDate}`);
    }

    const data = {
      time,
      source: 'METER',
      metrics: ['SUM'],
      population: [
        {
          type: 'USER',
          label: getCacheKey('METER', getState().user.profile.key, time),
          users: [getState().user.profile.key],
        },
      ],
    };

    return dispatch(queryDataAverageCache(data))
    .then(meters => meters.map(sessions => ({
      sessions,
    })));
  };
};

const queryMeterForecast = function (options) {
  return function (dispatch, getState) {
    const { time, label } = options;
    if (!time || !time.startDate || !time.endDate || time.granularity == null) {
      throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 
                      'time object with startDate, endDate and granularity');
    }
    const userKey = getState().user.profile.key;

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
          label,
          users: [userKey],
        }],
      },
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());
    return meterAPI.getForecast(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success || !Array.isArray(response.meters) || 
          !response.meters[0] || !response.meters[0].points) {
        throwServerError(response);  
      }
      return {
        label: response.meters[0].label,
        sessions: response.meters[0].points.map(session => ({ 
          ...session, 
          volume: session.volume.SUM 
        })),
      };
    })
    .catch((error) => {
      console.error('caught error in query meter forecast: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const queryMeterForecastCache = function (options) {
  return function (dispatch, getState) {
    const { time } = options;
    if (!time || !time.startDate || !time.endDate || time.granularity == null) {
      throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 
                      'time object with startDate, endDate and granularity');
    }
    const userKey = getState().user.profile.key;
    const cacheKey = getCacheKey('METER', userKey, time, ',forecast');

    return dispatch(fetchFromCache(cacheKey))
    .then(data => Promise.resolve(data))
    .catch(error => dispatch(queryMeterForecast(options))
      .then((series) => {
        dispatch(saveToCache(cacheKey, series));
        return series;
      })
    );
  };
};

const assignToMember = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, sessionId, memberIndex } = options;

    const data = {
      assignments: [{
        deviceKey,
        sessionId,
        memberIndex,
        timestamp: new Date().valueOf(),
      }],
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.assignToMember(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(clearCacheItems('AMPHIRO', deviceKey, sessionId));

      return response;
    })
    .catch((errors) => {
      console.error('Error caught on assign shower to member:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const ignoreShower = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, sessionId } = options;

    const data = {
      sessions: [{
        deviceKey,
        sessionId,
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
      
      dispatch(clearCacheItems('AMPHIRO', deviceKey, sessionId));

      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on ignore shower:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const queryUserComparisons = function (month, year) {
  return function (dispatch, getState) {
    const data = {
      year,
      month,
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.getComparisons(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success) {
        throwServerError(response);  
      } 
      
      return response.comparison;
    })
    .catch((error) => {
      console.error('caught error in fetch user comparisons: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const queryUserComparisonsByTime = function (time) {
  return function (dispatch, getState) {
    const { startDate, endDate, granularity } = time;
    
    const months = moment(endDate).diff(moment(startDate), 'months', true);
    const iters = Math.ceil(months / 6);

    return Promise.all(Array.from({ length: iters }, (x, i) => {
      const currDate = moment(endDate).subtract(i * 6, 'month');
      const month = currDate.month() + 1 <= 6 ? 6 : 12;
      const year = currDate.year();
      const cacheKey = getCacheKey('COMPARISON', null, month, year);
      return dispatch(fetchFromCache(cacheKey))
      .catch(error => dispatch(queryUserComparisons(month, year))
        .then((data) => { 
          dispatch(saveToCache(cacheKey, data)); 
          return data; 
        }));
    }));
  };
};

const fetchUserComparison = function (comparison, time) {
  return function (dispatch, getState) {
    const { startDate, endDate, granularity } = time;
    if (granularity !== 2 && granularity !== 4) {
      return Promise.reject('only day, month granularity supported in fetch comparisonByTime');
    }
    return dispatch(queryUserComparisonsByTime(time))
    .then(comparisonsArr => comparisonsArr.map((c) => {
      if (c === null) {
        return [];
      } else if (granularity === 2) {
        return c.dailyConsumtpion;
      } else if (granularity === 4) {
        return c.monthlyConsumtpion;
      }
      return [];
    }))
    .then(sessionsArr => sessionsArr.reduce((p, c) => [...p, ...c], []))
    .then(comparisons => comparisons.map(m => ({
      from: m.from,
      to: m.to,
      date: m.date,
      timestamp: granularity === 2 ? moment(m.date).valueOf() : moment(m.from).valueOf(),
      volume: m[comparison],
    })))
    .then(sessions => sessions.filter(s => granularity === 2 ? 
                  startDate <= moment(s.date).valueOf() && 
                    endDate >= moment(s.date).valueOf()
                  :
                  startDate <= moment(s.from).valueOf() &&
                    endDate >= moment(s.to).valueOf())
         );
  };
};

const fetchWaterIQ = function (options) {
  return function (dispatch, getState) {
    const { time } = options;
    const { startDate, endDate } = time;
    return dispatch(queryUserComparisonsByTime(time))
    .then(comparisonsArr => comparisonsArr.map(c => c == null ? [] : c.waterIq))
    .then(sessionsArr => sessionsArr.reduce((p, c) => [...p, ...c], []))
    .then(comparisons => comparisons.map(m => ({
      ...m,
      user: m.user.value,
      all: m.all.value,
      similar: m.similar.value,
      nearest: m.nearest.value,
      timestamp: moment(m.from).valueOf(),
      })))
    .then(sessions => sessions.filter(s => 
                  startDate <= moment(s.from).valueOf() && 
                    endDate >= moment(s.to).valueOf()));
  };
};

/**
 ** Fetch data based on provided options and handle query response before returning
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
      queryMeter = queryMeterHistory;
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
        } else if (type === 'comparison') {
          return Promise.all(['user', 'all', 'nearest', 'similar']
                             .map(id => dispatch(fetchUserComparison(id, time))
                                  .then(sessions => ({ id, sessions }))))
          .then(comparisons => ({ ...res, comparisons }));
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
      .then(data => ({ data }))
      .then(res => dispatch(queryDevice({
        cache,
        length: showerFilterToLength(period),
        deviceKey,
        index: -1,
      }))
      .then(prevData => ({ ...res, previous: prevData })));
    }
    return Promise.reject(new Error('noDeviceType'));
  };
};

module.exports = {
  queryDeviceSessionsCache,
  queryDeviceSessions,
  fetchDeviceSession,
  fetchLastDeviceSession,
  //queryMeterHistoryCache,
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
  queryMeterForecastCache,
  queryData,
  queryDataCache,
  queryDataAverageCache,
  ignoreShower,
  fetchWaterIQ,
  fetchUserComparison,
  assignToMember,
  ignoreShower,
};
