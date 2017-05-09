'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../../constants/ActionTypes');

var _require = require('../../constants/HomeConstants'),
    SUCCESS_SHOW_TIMEOUT = _require.SUCCESS_SHOW_TIMEOUT,
    SHOWERS_PAGE = _require.SHOWERS_PAGE;

var deviceAPI = require('../../api/device');
var dataAPI = require('../../api/data');

var sessionUtils = require('../../utils/sessions');
var genUtils = require('../../utils/general');
var timeUtils = require('../../utils/time');

var requestedQuery = function requestedQuery() {
  return {
    type: types.QUERY_REQUEST_START
  };
};

var receivedQuery = function receivedQuery(success, errors) {
  return {
    type: types.QUERY_REQUEST_END,
    success: success,
    errors: errors
  };
};

var queryData = function queryData(options) {
  return function (dispatch, getState) {
    var time = options.time,
        population = options.population,
        source = options.source,
        metrics = options.metrics;


    var data = {
      query: _extends({}, options, {
        usingPreAggregation: properties.dataApiUseAggregatedData
      }),
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return dataAPI.query(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);
      }
      // for cache
      var meters = response.meters || [];
      var devices = response.devices || [];
      return _extends({}, response, {
        meters: meters.map(function (m) {
          return _extends({}, m, { source: 'METER' });
        }),
        devices: devices.map(function (d) {
          return _extends({}, d, { source: 'AMPHIRO' });
        })
      });
    }).catch(function (error) {
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
var queryDeviceSessions = function queryDeviceSessions(options) {
  return function (dispatch, getState) {
    var data = _extends({}, options, {
      csrf: getState().user.csrf
    });

    dispatch(requestedQuery());

    return deviceAPI.querySessions(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success || !response.devices) {
        genUtils.throwServerError(response);
      }

      return response.devices;
    }).catch(function (error) {
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
var fetchDeviceSession = function fetchDeviceSession(options) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = _extends({}, options, {
      csrf: getState().user.csrf
    });

    return deviceAPI.getSession(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);
      }
      return response.session;
    }).catch(function (error) {
      console.error('caught error in fetch device sessions', error);
      throw error;
    });
  };
};

var queryMeterForecast = function queryMeterForecast(options) {
  return function (dispatch, getState) {
    var data = {
      query: _extends({}, options, {
        usingPreAggregation: properties.dataApiUseAggregatedData
      }),
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());
    return dataAPI.getForecast(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success || !Array.isArray(response.meters) || !response.meters[0] || !response.meters[0].points) {
        genUtils.throwServerError(response);
      }
      return response.meters;
    }).catch(function (error) {
      console.error('caught error in query meter forecast: ', error);
      throw error;
    });
  };
};

var queryUserComparisons = function queryUserComparisons(options) {
  return function (dispatch, getState) {
    var userKey = options.userKey,
        month = options.month,
        year = options.year;


    var data = _extends({}, options, {
      csrf: getState().user.csrf
    });

    dispatch(requestedQuery());

    return dataAPI.getComparisons(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);
      }

      return response.comparison;
    }).catch(function (error) {
      console.error('caught error in fetch user comparisons: ', error);
      throw error;
    });
  };
};

var fetchWaterBreakdown = function fetchWaterBreakdown() {
  return function (dispatch, getState) {
    var data = {
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return dataAPI.getWaterBreakdown(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);
      }
      return response.labels;
    }).catch(function (error) {
      console.error('Error caught on fetch water breakdown:', error);
      throw error;
    });
  };
};

var fetchPriceBrackets = function fetchPriceBrackets() {
  return function (dispatch, getState) {
    var data = {
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return dataAPI.getPriceBrackets(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        genUtils.throwServerError(response);
      }
      return response.brackets;
    }).catch(function (error) {
      console.error('Error caught on get price brackets:', error);
      throw error;
    });
  };
};

module.exports = {
  queryData: queryData,
  queryDeviceSessions: queryDeviceSessions,
  fetchDeviceSession: fetchDeviceSession,
  queryMeterForecast: queryMeterForecast,
  queryUserComparisons: queryUserComparisons,
  fetchWaterBreakdown: fetchWaterBreakdown,
  fetchPriceBrackets: fetchPriceBrackets
};