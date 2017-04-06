'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('../../constants/ActionTypes');

var _require = require('../../constants/HomeConstants'),
    SHOWERS_PAGE = _require.SHOWERS_PAGE;

var QueryActions = require('./ApiActions');

var _require2 = require('../CacheActions'),
    fetchFromCache = _require2.fetchFromCache,
    saveToCache = _require2.saveToCache;

var cacheUtils = require('../../utils/cache');
var sessionUtils = require('../../utils/sessions');
var genUtils = require('../../utils/general');

var queryData = function queryData(options) {
  return function (dispatch, getState) {
    var time = options.time,
        length = options.length,
        index = options.index,
        population = options.population,
        source = options.source,
        metrics = options.metrics;
    var cache = getState().query.cache;


    var inCache = population.filter(function (group) {
      return cache[group.label] != null;
    });
    var notInCache = population.filter(function (group) {
      return !inCache.includes(group);
    });

    var inCachePromise = Promise.all(inCache.map(function (group) {
      return dispatch(fetchFromCache(group.label));
    }));

    if (notInCache.length === 0) {
      return inCachePromise.then(function (inCacheData) {
        return {
          devices: inCacheData.filter(function (d) {
            return d.source === 'AMPHIRO';
          }),
          meters: inCacheData.filter(function (d) {
            return d.source === 'METER';
          })
        };
      });
    }
    return dispatch(QueryActions.queryData(_extends({}, options, { population: notInCache }))).then(function (response) {
      [].concat(_toConsumableArray(response.meters), _toConsumableArray(response.devices)).forEach(function (device) {
        dispatch(saveToCache(device.label, device));
      });
      return inCachePromise.then(function (inCacheData) {
        return _extends({}, response, {
          devices: [].concat(_toConsumableArray(response.devices), _toConsumableArray(inCacheData.filter(function (d) {
            return d.source === 'AMPHIRO';
          }))),
          meters: [].concat(_toConsumableArray(response.meters), _toConsumableArray(inCacheData.filter(function (d) {
            return d.source === 'METER';
          })))
        });
      });
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

var queryDeviceSessions = function queryDeviceSessions(options) {
  return function (dispatch, getState) {
    var length = options.length,
        userKey = options.userKey,
        deviceKey = options.deviceKey,
        type = options.type,
        _options$memberFilter = options.memberFilter,
        memberFilter = _options$memberFilter === undefined ? 'all' : _options$memberFilter,
        _options$index = options.index,
        index = _options$index === undefined ? 0 : _options$index;


    var cacheKey = cacheUtils.getCacheKey('AMPHIRO', memberFilter, length, index);
    var startIndex = SHOWERS_PAGE * genUtils.getShowersPagingIndex(length, index);

    // if item found in cache return it
    return dispatch(fetchFromCache(cacheKey)).then(function (data) {
      var deviceData = sessionUtils.filterDataByDeviceKeys(data, deviceKey);
      return Promise.resolve(sessionUtils.filterShowers(deviceData, length, index));
    }).catch(function (error) {
      var newOptions = _extends({}, options, {
        length: SHOWERS_PAGE,
        startIndex: startIndex,
        memberFilter: memberFilter,
        userKey: userKey,
        deviceKey: null });

      return dispatch(QueryActions.queryDeviceSessions(newOptions)).then(function (data) {
        dispatch(saveToCache(cacheKey, data));
        // return only the items requested
        var deviceData = sessionUtils.filterDataByDeviceKeys(data, deviceKey);
        return sessionUtils.filterShowers(deviceData, length, index);
      });
    });
  };
};

var queryMeterForecast = function queryMeterForecast(options) {
  return function (dispatch, getState) {
    var userKey = options.userKey,
        time = options.time;

    if (!time || !time.startDate || !time.endDate || time.granularity == null) {
      throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 'time object with startDate, endDate and granularity');
    }
    var cacheKey = cacheUtils.getCacheKey('FORECAST', userKey, time);

    return dispatch(fetchFromCache(cacheKey)).then(function (data) {
      return Promise.resolve(data);
    }).catch(function (error) {
      return dispatch(QueryActions.queryMeterForecast(options)).then(function (series) {
        dispatch(saveToCache(cacheKey, series));
        return series;
      });
    });
  };
};

var queryUserComparisons = function queryUserComparisons(options) {
  return function (dispatch, getState) {
    var userKey = options.userKey,
        month = options.month,
        year = options.year;


    var cacheKey = cacheUtils.getCacheKey('COMPARISON', userKey, month, year);
    return dispatch(fetchFromCache(cacheKey)).catch(function (error) {
      return dispatch(QueryActions.queryUserComparisons({ userKey: userKey, month: month, year: year })).then(function (data) {
        dispatch(saveToCache(cacheKey, data));
        return data;
      });
    });
  };
};

module.exports = _extends({}, QueryActions, {
  queryData: queryData,
  queryDeviceSessions: queryDeviceSessions,
  queryMeterForecast: queryMeterForecast,
  queryUserComparisons: queryUserComparisons
});