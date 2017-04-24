const types = require('../../constants/ActionTypes');
const { SHOWERS_PAGE } = require('../../constants/HomeConstants');

const { fetchFromCache, saveToCache } = require('../CacheActions'); 

const cacheUtils = require('../../utils/cache');
const sessionUtils = require('../../utils/sessions');
const genUtils = require('../../utils/general');

const defaultCachePath = state => state.query.cache;

const connectCacheActionsToQueryBackend = function (QueryBackend, cachePath = defaultCachePath) {
  const queryData = function (options) {
    return function (dispatch, getState) {
      const { time, length, index, population, source, metrics } = options;
      const cache = cachePath(getState());

      const populationWithLabels = population.map(group => ({ 
        ...group, 
        label: cacheUtils.getPopulationCacheKey(group, source, time), 
      }));
      const inCache = populationWithLabels.filter(group => cache[group.label] != null);
      const notInCache = populationWithLabels.filter(group => !inCache.includes(group));

      const inCachePromise = Promise.all(inCache.map(group => dispatch(fetchFromCache(cache, group.label))));

      if (notInCache.length === 0) {
        return inCachePromise
        .then(inCacheData => ({
          devices: inCacheData.filter(d => d.source === 'AMPHIRO'),
          meters: inCacheData.filter(d => d.source === 'METER'),
        }));
      } 
      return dispatch(QueryBackend.queryData({ ...options, population: notInCache }))
      .then((response) => {
        [...response.meters, ...response.devices].forEach((device) => {
          dispatch(saveToCache(cache, device.label, device));
        });
        return inCachePromise.then(inCacheData => ({
            ...response,
            devices: [
              ...response.devices,
              ...inCacheData.filter(d => d.source === 'AMPHIRO'),
            ],
            meters: [
              ...response.meters,
              ...inCacheData.filter(d => d.source === 'METER'),
            ],
          }));
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

  const queryDeviceSessions = function (options) {
    return function (dispatch, getState) {
      const { length, userKey, deviceKey, type, memberFilter, members, index = 0 } = options;
      const cache = cachePath(getState());
      const cacheKey = cacheUtils.getCacheKey('AMPHIRO', memberFilter, length, index);
      const startIndex = SHOWERS_PAGE * genUtils.getShowersPagingIndex(length, index);

      // if item found in cache return it
      return dispatch(fetchFromCache(cache, cacheKey))
      .then((data) => {
        const deviceData = sessionUtils.filterDataByDeviceKeys(data, deviceKey);
        return Promise.resolve(sessionUtils.filterShowers(deviceData, length, index));
      })
      .catch((error) => {
        const newOptions = {
          ...options, 
          length: SHOWERS_PAGE,
          startIndex,
          userKey,
          deviceKey: null, //null for all user devices
        };
        
        return dispatch(QueryBackend.queryDeviceSessions(newOptions))
        .then((data) => {
          dispatch(saveToCache(cache, cacheKey, data));
          // return only the items requested
          const deviceData = sessionUtils.filterDataByDeviceKeys(data, deviceKey);
          return sessionUtils.filterShowers(deviceData, length, index);
        });
      }); 
    };
  };

  const queryMeterForecast = function (options) {
    return function (dispatch, getState) {
      const { population, time } = options;
      const cache = cachePath(getState());
      const cacheKey = cacheUtils.getPopulationCacheKey(population[0], 'FORECAST', time);

      return dispatch(fetchFromCache(cache, cacheKey))
      .then(data => Promise.resolve(data))
      .catch(error => dispatch(QueryBackend.queryMeterForecast(options))
        .then((series) => {
          dispatch(saveToCache(cache, cacheKey, series));
          return series;
        })
      );
    };
  };

  const queryUserComparisons = function (options) {
    return function (dispatch, getState) {
      const { userKey, month, year } = options;
      const cache = cachePath(getState());
      const cacheKey = cacheUtils.getCacheKey('COMPARISON', userKey, month, year);

      return dispatch(fetchFromCache(cache, cacheKey))
      .catch(error => dispatch(QueryBackend.queryUserComparisons({ userKey, month, year }))
        .then((data) => { 
          dispatch(saveToCache(cache, cacheKey, data)); 
          return data; 
        }));
    };
  };

  return {
    ...QueryBackend,
    queryData,
    queryDeviceSessions,
    queryMeterForecast,
    queryUserComparisons,
  };
};

module.exports = connectCacheActionsToQueryBackend;
