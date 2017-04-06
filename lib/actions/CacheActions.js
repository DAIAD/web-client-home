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

var clearCacheItems = function clearCacheItems(deviceType) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return function (dispatch, getState) {
    var cache = getState().query.cache;

    dispatch(setCache(cacheUtils.filterCacheItems.apply(cacheUtils, [cache, deviceType].concat(rest))));
  };
};

var saveToCache = function saveToCache(cacheKey, data) {
  return function (dispatch, getState) {
    var cache = getState().query.cache;

    if (!cacheKey) return;
    if (Object.keys(cache).length >= CACHE_SIZE) {
      (function () {
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
      })();
    }
    dispatch({
      type: types.QUERY_SAVE_TO_CACHE,
      key: cacheKey,
      data: data
    });
  };
};

var fetchFromCache = function fetchFromCache(cacheKey) {
  return function (dispatch, getState) {
    if (getState().query.cache[cacheKey]) {
      dispatch(cacheItemRequested(cacheKey));
      var data = getState().query.cache[cacheKey].data;

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