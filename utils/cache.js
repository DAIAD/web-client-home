const { getShowersPagingIndex } = require('./general');
const { SHOWERS_PAGE } = require('../constants/HomeConstants');

const getAmphiroCacheKey = function (key, length, index) {
  if (key == null) {
    console.error('cache key undefined');
  }
  const cacheIdx = -1 * getShowersPagingIndex(length, index);
  return `AMPHIRO,${key},${SHOWERS_PAGE},${cacheIdx}`;
};

const getAmphiroByTimeCacheKey = function (key, time, extra = '') {
  return `AMPHIRO_TIME,${key},${time.startDate},${time.endDate}${extra}`;
};

const getMeterCacheKey = function (key, time, extra = '') {
  return `METER,${key},${time.startDate},${time.endDate}${extra}`;
};

const getComparisonCacheKey = function (key, month, year) {
  return `COMPARISON,${year},${month}`;
};

const getCacheKey = function (deviceType, key, ...rest) {
  if (deviceType === 'AMPHIRO') {
    if (rest.length < 2) {
      throw new Error('cant get amphiro cache key without members, length, index');
    }
    return getAmphiroCacheKey(key, ...rest);
  } else if (deviceType === 'AMPHIRO_TIME') {
    return getAmphiroByTimeCacheKey(key, ...rest);
  } else if (deviceType === 'METER') {
    return getMeterCacheKey(key, ...rest);
  } else if (deviceType === 'COMPARISON') {
    return getComparisonCacheKey(key, ...rest);
  }
  throw new Error(`deviceType ${deviceType} not supported`);
};

//TODO: user rest parameters to filter specific cache items instead of all 
const filterCacheItems = function (cache, deviceType, ...rest) {
  return Object.keys(cache)
  .filter(key => !key.startsWith(deviceType))
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
