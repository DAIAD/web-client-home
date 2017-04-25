'use strict';

var types = require('../constants/ActionTypes');

var cacheUtils = require('../utils/cache');

var _require = require('../constants/HomeConstants'),
    CACHE_SIZE = _require.CACHE_SIZE;

var cacheItemRequested = function cacheItemRequested(cacheKey) {
  return {
    type: types.QUERY_CACHE_ITEM_REQUESTED,
    key: cacheKey
  };
};

var setCache = function setCache(cache) {
  return {
    type: types.QUERY_SET_CACHE,
    cache: cache
  };
};

var clearCacheItems = function clearCacheItems(cache, deviceType) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return function (dispatch, getState) {
    dispatch(setCache(cacheUtils.filterCacheItems.apply(cacheUtils, [cache, deviceType].concat(rest))));
  };
};

var saveToCache = function saveToCache(cache, cacheKey, data) {
  return function (dispatch, getState) {
    if (!cacheKey) return;
    if (Object.keys(cache).length >= CACHE_SIZE) {
      console.warn('Cache limit exceeded, making space by emptying LRU...');

      var newCacheKeys = Object.keys(cache).sort(function (a, b) {
        return cache[b].counter - cache[a].counter;
      }).filter(function (x, i) {
        return i < Object.keys(cache).length - 1;
      });

      var newCache = {};
      newCacheKeys.forEach(function (key) {
        newCache[key] = cache[key];
      });

      dispatch(setCache(newCache));
    }
    dispatch({
      type: types.QUERY_SAVE_TO_CACHE,
      key: cacheKey,
      data: data
    });
  };
};

var fetchFromCache = function fetchFromCache(cache, cacheKey) {
  return function (dispatch, getState) {
    if (cache[cacheKey]) {
      dispatch(cacheItemRequested(cacheKey));
      var data = cache[cacheKey].data;

      return Promise.resolve(data);
    }
    return Promise.reject('notFound');
  };
};

module.exports = {
  clearCacheItems: clearCacheItems,
  saveToCache: saveToCache,
  fetchFromCache: fetchFromCache
};