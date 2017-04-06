const types = require('../../constants/ActionTypes');
const { SHOWERS_PAGE } = require('../../constants/HomeConstants');

const QueryActions = require('./ApiActions');
const { fetchFromCache, saveToCache } = require('../CacheActions'); 

const cacheUtils = require('../../utils/cache');
const sessionUtils = require('../../utils/sessions');
const genUtils = require('../../utils/general');

const queryData = function (options) {
  return function (dispatch, getState) {
    const { time, length, index, population, source, metrics } = options;
    const { cache } = getState().query;

    const populationWithLabels = population.map(group => ({ 
      ...group, 
      label: cacheUtils.getPopulationCacheKey(group, source, time), 
    }));
    const inCache = populationWithLabels.filter(group => cache[group.label] != null);
    const notInCache = populationWithLabels.filter(group => !inCache.includes(group));

    const inCachePromise = Promise.all(inCache.map(group => dispatch(fetchFromCache(group.label))));

    if (notInCache.length === 0) {
      return inCachePromise
      .then(inCacheData => ({
        devices: inCacheData.filter(d => d.source === 'AMPHIRO'),
        meters: inCacheData.filter(d => d.source === 'METER'),
      }));
    } 
    return dispatch(QueryActions.queryData({ ...options, population: notInCache }))
    .then((response) => {
      [...response.meters, ...response.devices].forEach((device) => {
        dispatch(saveToCache(device.label, device));
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
    const cacheKey = cacheUtils.getCacheKey('AMPHIRO', memberFilter, length, index);
    const startIndex = SHOWERS_PAGE * genUtils.getShowersPagingIndex(length, index);

    // if item found in cache return it
    return dispatch(fetchFromCache(cacheKey))
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
      
      return dispatch(QueryActions.queryDeviceSessions(newOptions))
      .then((data) => {
        dispatch(saveToCache(cacheKey, data));
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
    const cacheKey = cacheUtils.getPopulationCacheKey(population[0], 'FORECAST', time);

    return dispatch(fetchFromCache(cacheKey))
    .then(data => Promise.resolve(data))
    .catch(error => dispatch(QueryActions.queryMeterForecast(options))
      .then((series) => {
        dispatch(saveToCache(cacheKey, series));
        return series;
      })
    );
  };
};

const queryUserComparisons = function (options) {
  return function (dispatch, getState) {
    const { userKey, month, year } = options;
    const cacheKey = cacheUtils.getCacheKey('COMPARISON', userKey, month, year);

    return dispatch(fetchFromCache(cacheKey))
    .catch(error => dispatch(QueryActions.queryUserComparisons({ userKey, month, year }))
      .then((data) => { 
        dispatch(saveToCache(cacheKey, data)); 
        return data; 
      }));
  };
};

module.exports = {
  ...QueryActions,
  queryData,
  queryDeviceSessions,
  queryMeterForecast,
  queryUserComparisons,
};
