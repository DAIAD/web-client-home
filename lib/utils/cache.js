'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./general'),
    getShowersPagingIndex = _require.getShowersPagingIndex;

var _require2 = require('../constants/HomeConstants'),
    SHOWERS_PAGE = _require2.SHOWERS_PAGE;

var getAmphiroCacheKey = function getAmphiroCacheKey(key, length, index) {
  if (key == null) {
    console.error('cache key undefined');
  }
  var cacheIdx = -1 * getShowersPagingIndex(length, index);
  return 'AMPHIRO,' + key + ',' + SHOWERS_PAGE + ',' + cacheIdx;
};

var getAmphiroByTimeCacheKey = function getAmphiroByTimeCacheKey(key, time) {
  return 'AMPHIRO_TIME,' + key + ',' + time.start + ',' + time.end;
};

var getMeterCacheKey = function getMeterCacheKey(key, time) {
  return 'METER,' + key + ',' + time.start + ',' + time.end;
};

var getComparisonCacheKey = function getComparisonCacheKey(key, month, year) {
  return 'COMPARISON,' + key + ',' + year + ',' + month;
};

var getForecastCacheKey = function getForecastCacheKey(key, time) {
  return 'FORECAST,' + key + ',' + time.start + ',' + time.end;
};

var getCacheKey = function getCacheKey(type, key) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (type === 'AMPHIRO') {
    if (rest.length < 2) {
      throw new Error('cant get amphiro cache key without members, length, index');
    }
    return getAmphiroCacheKey.apply(undefined, [key].concat(rest));
  } else if (type === 'AMPHIRO_TIME') {
    return getAmphiroByTimeCacheKey.apply(undefined, [key].concat(rest));
  } else if (type === 'METER') {
    return getMeterCacheKey.apply(undefined, [key].concat(rest));
  } else if (type === 'COMPARISON') {
    return getComparisonCacheKey.apply(undefined, [key].concat(rest));
  } else if (type === 'FORECAST') {
    return getForecastCacheKey.apply(undefined, [key].concat(rest));
  }
  throw new Error('type ' + type + ' not supported');
};

var getPopulationCacheKey = function getPopulationCacheKey(population, source, time) {
  var type = population.type;

  var sourceType = source === 'AMPHIRO' ? 'AMPHIRO_TIME' : source;
  var key = void 0;
  if (type === 'USER') {
    key = Array.isArray(population.users) && population.users.length > 0 && population.users[0];
  } else if (type === 'UTILITY') {
    key = population.utility;
  } else if (type === 'GROUP') {
    key = population.group;
  }

  if (!key) {
    throw new Error('noPopulationCacheKey');
  }
  return getCacheKey(sourceType, key, time);
};

//TODO: user rest parameters to filter specific cache items instead of all 
var filterCacheItems = function filterCacheItems(cache, type) {
  return Object.keys(cache).filter(function (key) {
    return !key.startsWith(type);
  }).reduce(function (p, c) {
    var n = _extends({}, p);
    n[c] = cache[c];
    return n;
  }, {});
};

module.exports = {
  getCacheKey: getCacheKey,
  getPopulationCacheKey: getPopulationCacheKey,
  filterCacheItems: filterCacheItems
};