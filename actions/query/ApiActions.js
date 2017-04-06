const types = require('../../constants/ActionTypes');
const { SUCCESS_SHOW_TIMEOUT, SHOWERS_PAGE } = require('../../constants/HomeConstants');

const deviceAPI = require('../../api/device');
const dataAPI = require('../../api/data');

const sessionUtils = require('../../utils/sessions');
const genUtils = require('../../utils/general');
const timeUtils = require('../../utils/time');


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

const queryData = function (options) {
  return function (dispatch, getState) {
    const { time, population, source, metrics } = options;
    
    const data = {
      query: {
        time: timeUtils.convertOldTimeObject(time),
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
        genUtils.throwServerError(response);  
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
    const { length, deviceKey, userKey, memberFilter = 'all' } = options;
    
    if (!length) {
      throw new Error('Not sufficient data provided for device sessions query');
    }
    const members = genUtils.memberFilterToMembers(memberFilter);
    
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
        genUtils.throwServerError(response);  
      }
      
      return response.devices.map(session => ({ 
        ...session,
        range: session.sessions ? sessionUtils.getShowerRange(session.sessions) : {}
      }));
    })
    .catch((error) => {
      dispatch(receivedQuery(false, error));
      throw error;
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
const fetchDeviceSession = function (options) {
  return function (dispatch, getState) {
    const { id, deviceKey } = options;

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
          genUtils.throwServerError(response);  
        }
        return response.session;
      })
      .catch((errors) => {
        dispatch(receivedQuery(false, errors));
        throw errors;
      });
  };
};

const queryMeterForecast = function (options) {
  return function (dispatch, getState) {
    const { time, label, userKey } = options;
    if (!time || !time.startDate || !time.endDate || time.granularity == null) {
      throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 
                      'time object with startDate, endDate and granularity');
    }
    const data = {
      query: {
        time: timeUtils.convertOldTimeObject(time),
        population: [{
          type: 'USER',
          label,
          users: [userKey],
        }],
      },
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());
    return dataAPI.getForecast(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());
      
      if (!response || !response.success || !Array.isArray(response.meters) || 
          !response.meters[0] || !response.meters[0].points) {
        genUtils.throwServerError(response);  
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

const queryUserComparisons = function (options) {
  return function (dispatch, getState) {
    const { userKey, month, year } = options;

    const data = {
      userKey,
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
        genUtils.throwServerError(response);  
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

const fetchWaterBreakdown = function () {
  return function (dispatch, getState) {
    const data = {
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.getWaterBreakdown(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.labels;
    }) 
    .catch((errors) => {
      console.error('Error caught on fetch water breakdown:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const fetchPriceBrackets = function () {
  return function (dispatch, getState) {
    const data = {
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.getPriceBrackets(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.brackets;
    }) 
    .catch((errors) => {
      console.error('Error caught on get price brackets:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  queryData,
  queryDeviceSessions,
  fetchDeviceSession,
  queryMeterForecast,
  queryUserComparisons,
  fetchWaterBreakdown,
  fetchPriceBrackets,
};
