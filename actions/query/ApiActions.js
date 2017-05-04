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

const queryData = function (options) {
  return function (dispatch, getState) {
    const { time, population, source, metrics } = options;
    
    const data = {
      query: {
        ...options,
        usingPreAggregation: properties.dataApiUseAggregatedData,
      },
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.query(data)
    .then((response) => {
      dispatch(receivedQuery());
      
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      // for cache
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
    const data = {
      ...options,
      csrf: getState().user.csrf,
    };
    
    dispatch(requestedQuery());

    return deviceAPI.querySessions(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success || !response.devices) {
        genUtils.throwServerError(response);  
      }
      
      return response.devices;
    })
    .catch((error) => {
      console.error('caught error in query device sessions', error);
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
    dispatch(requestedQuery());

    const data = {
      ...options,
      csrf: getState().user.csrf,
    };

    return deviceAPI.getSession(data)
      .then((response) => {
        dispatch(receivedQuery());
        
        if (!response || !response.success) {
          genUtils.throwServerError(response);  
        }
        return response.session;
      })
      .catch((error) => {
        console.error('caught error in fetch device sessions', error);
        throw error;
      });
  };
};

const queryMeterForecast = function (options) {
  return function (dispatch, getState) {
    const data = {
      query: {
        ...options,
        usingPreAggregation: properties.dataApiUseAggregatedData,
      },
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());
    return dataAPI.getForecast(data)
    .then((response) => {
      dispatch(receivedQuery());
      
      if (!response || !response.success || !Array.isArray(response.meters) || 
          !response.meters[0] || !response.meters[0].points) {
        genUtils.throwServerError(response);  
      }
      return response.meters;
    })
    .catch((error) => {
      console.error('caught error in query meter forecast: ', error);
      throw error;
    });
  };
};

const queryUserComparisons = function (options) {
  return function (dispatch, getState) {
    const { userKey, month, year } = options;

    const data = {
      ...options,
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return dataAPI.getComparisons(data)
    .then((response) => {
      dispatch(receivedQuery());
      
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      } 
      
      return response.comparison;
    })
    .catch((error) => {
      console.error('caught error in fetch user comparisons: ', error);
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
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.labels;
    }) 
    .catch((error) => {
      console.error('Error caught on fetch water breakdown:', error);
      throw error;
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
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.brackets;
    }) 
    .catch((error) => {
      console.error('Error caught on get price brackets:', error);
      throw error;
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
