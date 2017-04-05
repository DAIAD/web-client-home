const types = require('../constants/ActionTypes');

const cacheUtils = require('../utils/cache');

const { CACHE_SIZE } = require('../constants/HomeConstants');

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
    dispatch(setCache(cacheUtils.filterCacheItems(cache, deviceType, ...rest)));
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

module.exports = {
  clearCacheItems,
  saveToCache,
  fetchFromCache,
};
