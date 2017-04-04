const { getShowersPagingIndex } = require('./general');
const { SHOWERS_PAGE } = require('../constants/HomeConstants');

const getAmphiroCacheKey = function (key, length, index) {
  if (key == null) {
    console.error('cache key undefined');
  }
  const cacheIdx = -1 * getShowersPagingIndex(length, index);
  return `AMPHIRO,${key},${SHOWERS_PAGE},${cacheIdx}`;
};

const getAmphiroByTimeCacheKey = function (key, time) {
  return `AMPHIRO_TIME,${key},${time.startDate},${time.endDate}`;
};

const getMeterCacheKey = function (key, time) {
  return `METER,${key},${time.startDate},${time.endDate}`;
};

const getComparisonCacheKey = function (key, month, year) {
  return `COMPARISON,${key},${year},${month}`;
};

const getForecastCacheKey = function (key, time) {
  return `FORECAST,${key},${time.startDate},${time.endDate}`;
};

const getCacheKey = function (type, key, ...rest) {
  if (type === 'AMPHIRO') {
    if (rest.length < 2) {
      throw new Error('cant get amphiro cache key without members, length, index');
    }
    return getAmphiroCacheKey(key, ...rest);
  } else if (type === 'AMPHIRO_TIME') {
    return getAmphiroByTimeCacheKey(key, ...rest);
  } else if (type === 'METER') {
    return getMeterCacheKey(key, ...rest);
  } else if (type === 'COMPARISON') {
    return getComparisonCacheKey(key, ...rest);
  } else if (type === 'FORECAST') {
    return getForecastCacheKey(key, ...rest);
  }
  throw new Error(`type ${type} not supported`);
};

//TODO: user rest parameters to filter specific cache items instead of all 
const filterCacheItems = function (cache, type, ...rest) {
  return Object.keys(cache)
  .filter(key => !key.startsWith(type))
  .reduce((p, c) => {
    const n = { ...p };
    n[c] = cache[c];
    return n;
  }, {});
};

module.exports = {
  getCacheKey,
  filterCacheItems,
};
