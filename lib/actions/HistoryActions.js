'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * History Actions module.
 * Action creators for History section
 * 
 * @module HistoryActions
 */

var types = require('../constants/ActionTypes');

var _require = require('react-router-redux'),
    push = _require.push;

var _require2 = require('./FormActions'),
    setForm = _require2.setForm;

var _require3 = require('../utils/device'),
    getDeviceKeysByType = _require3.getDeviceKeysByType,
    getDeviceTypeByKey = _require3.getDeviceTypeByKey;

var _require4 = require('../utils/time'),
    getTimeByPeriod = _require4.getTimeByPeriod,
    getPreviousPeriod = _require4.getPreviousPeriod,
    getGranularityByDiff = _require4.getGranularityByDiff;

var _require5 = require('../utils/sessions'),
    getSessionById = _require5.getSessionById,
    getShowerRange = _require5.getShowerRange,
    getLastShowerIdFromMultiple = _require5.getLastShowerIdFromMultiple,
    hasShowersBefore = _require5.hasShowersBefore,
    hasShowersAfter = _require5.hasShowersAfter,
    isValidShowerIndex = _require5.isValidShowerIndex;

var _require6 = require('../utils/general'),
    showerFilterToLength = _require6.showerFilterToLength;

var QueryActions = require('./QueryActions');

var _require7 = require('../constants/HomeConstants'),
    PERIODS = _require7.PERIODS;

var setSessions = function setSessions(sessions) {
  return {
    type: types.HISTORY_SET_SESSIONS,
    sessions: sessions
  };
};

var setSession = function setSession(session) {
  return {
    type: types.HISTORY_SET_SESSION,
    session: session
  };
};

var setDataSynced = function setDataSynced() {
  return {
    type: types.HISTORY_SET_DATA_SYNCED
  };
};

var setDataUnsynced = function setDataUnsynced() {
  return {
    type: types.HISTORY_SET_DATA_UNSYNCED
  };
};

var setForecastData = function setForecastData(data) {
  return {
    type: types.HISTORY_SET_FORECAST_DATA,
    data: data
  };
};

var enableEditShower = function enableEditShower() {
  return {
    type: types.HISTORY_SET_EDIT_SHOWER,
    enable: true
  };
};

var disableEditShower = function disableEditShower() {
  return {
    type: types.HISTORY_SET_EDIT_SHOWER,
    enable: false
  };
};

var setMemberFilter = function setMemberFilter(filter) {
  return {
    type: types.HISTORY_SET_MEMBER_FILTER,
    filter: filter
  };
};

/**
 * Sets comparison filter. Currently active only for deviceType METER
 *
 * @param {String} comparison - Comparison filter. One of: 
 * last (compare with user data from last period) 
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */
var setComparisons = function setComparisons(comparisons) {
  return {
    type: types.HISTORY_SET_COMPARISONS,
    comparisons: comparisons
  };
};

var resetComparisons = function resetComparisons() {
  return {
    type: types.HISTORY_CLEAR_COMPARISONS
  };
};

var addComparison = function addComparison(id) {
  return {
    type: types.HISTORY_ADD_COMPARISON,
    id: id
  };
};
var removeComparison = function removeComparison(id) {
  return {
    type: types.HISTORY_REMOVE_COMPARISON,
    id: id
  };
};

var setComparisonSessions = function setComparisonSessions(id, sessions) {
  return {
    type: types.HISTORY_SET_COMPARISON_SESSIONS,
    id: id,
    sessions: sessions
  };
};

var setWaterIQSessions = function setWaterIQSessions(sessions) {
  return {
    type: types.HISTORY_SET_WATERIQ_SESSIONS,
    sessions: sessions
  };
};

var fetchComparison = function fetchComparison(id, query) {
  return function (dispatch, getState) {
    if (!Array.isArray(query.population) || query.population.length !== 1) {
      console.error('must provide only one population item for comparison');
      return Promise.reject();
    }
    return dispatch(QueryActions.queryDataAverage(query)).then(function (populations) {
      return Array.isArray(populations) && populations.length > 0 ? populations[0] : [];
    }).then(function (common) {
      return dispatch(setComparisonSessions(id, common));
    });
  };
};

var fetchComparisonData = function fetchComparisonData() {
  return function (dispatch, getState) {
    var _getState$section$his = getState().section.history,
        comparisons = _getState$section$his.comparisons,
        activeDeviceType = _getState$section$his.activeDeviceType,
        activeDevice = _getState$section$his.activeDevice,
        timeFilter = _getState$section$his.timeFilter,
        showerIndex = _getState$section$his.showerIndex,
        time = _getState$section$his.time;

    var userKey = getState().user.profile.key;
    var utilityKey = getState().user.profile.utility.key;
    var commonKey = getState().section.settings.commons.favorite;

    return Promise.all(comparisons.map(function (comparison) {
      if (comparison.id === 'last') {
        var prevTime = getPreviousPeriod(timeFilter, time.startDate);
        return dispatch(fetchComparison('last', {
          time: prevTime,
          source: activeDeviceType,
          population: [{
            type: 'USER',
            users: [userKey]
          }]
        }));
      } else if (comparison.id === 'all') {
        return dispatch(fetchComparison('all', {
          time: time,
          source: activeDeviceType,
          population: [{
            type: 'UTILITY',
            utility: utilityKey
          }]
        }));
      } else if (comparison.id === 'common') {
        return dispatch(fetchComparison('common', {
          time: time,
          source: activeDeviceType,
          population: [{
            type: 'GROUP',
            group: commonKey
          }]
        }));
      } else if (comparison.id === 'nearest') {
        return dispatch(QueryActions.fetchUserComparison({
          comparison: 'nearest',
          time: time,
          userKey: getState().user.profile.key
        })).then(function (nearest) {
          return dispatch(setComparisonSessions('nearest', nearest));
        });
      } else if (comparison.id === 'similar') {
        return dispatch(QueryActions.fetchUserComparison({
          comparison: 'similar',
          time: time,
          userKey: getState().user.profile.key
        })).then(function (nearest) {
          return dispatch(setComparisonSessions('similar', nearest));
        });
      } else if (activeDeviceType === 'AMPHIRO' && !isNaN(comparison.id)) {
        return dispatch(QueryActions.queryDeviceSessions({
          deviceKey: activeDevice,
          length: showerFilterToLength(timeFilter),
          index: showerIndex,
          memberFilter: comparison.id
        })).then(function (sessions) {
          dispatch(setComparisonSessions(comparison.id, sessions));
        });
      }
      return Promise.resolve();
    }));
  };
};

var fetchForecastData = function fetchForecastData() {
  return function (dispatch, getState) {
    var time = getState().section.history.time;

    dispatch(QueryActions.queryMeterForecast({
      time: time,
      userKey: getState().user.profile.key
    })).then(function (sessions) {
      var sortedByTime = sessions.sort(function (a, b) {
        if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;
        return 0;
      });
      dispatch(setForecastData({ sessions: sortedByTime }));
    }).catch(function (error) {
      dispatch(setForecastData({}));
      console.error('Caught error in history forecast query:', error);
    });
  };
};

var fetchWaterIQData = function fetchWaterIQData() {
  return function (dispatch, getState) {
    var time = getState().section.history.time;

    return dispatch(QueryActions.fetchWaterIQ({
      time: time,
      userKey: getState().user.profile.key
    })).then(function (waterIQData) {
      dispatch(setWaterIQSessions(waterIQData));
    }).catch(function (error) {
      dispatch(setWaterIQSessions([]));
      console.error('Caught error in history water iq query:', error);
    });
  };
};
/**
 * Performs query based on selected history section filters and saves data
 */
var fetchData = function fetchData() {
  return function (dispatch, getState) {
    var _getState$section$his2 = getState().section.history,
        showerIndex = _getState$section$his2.showerIndex,
        activeDeviceType = _getState$section$his2.activeDeviceType,
        activeDevice = _getState$section$his2.activeDevice,
        timeFilter = _getState$section$his2.timeFilter,
        time = _getState$section$his2.time,
        data = _getState$section$his2.data,
        memberFilter = _getState$section$his2.memberFilter,
        synced = _getState$section$his2.synced;
    // AMPHIRO

    if (activeDeviceType === 'AMPHIRO') {
      if (activeDevice.length === 0) {
        dispatch(setSessions([]));
        dispatch(setDataSynced());
        return Promise.resolve();
      }

      return dispatch(QueryActions.queryDeviceSessions({
        deviceKey: activeDevice,
        length: showerFilterToLength(timeFilter),
        index: showerIndex,
        memberFilter: memberFilter
      })).then(function (sessions) {
        dispatch(setSessions(sessions));
      }).then(function () {
        return dispatch(fetchComparisonData());
      }).then(function () {
        return dispatch(setDataSynced());
      }).catch(function (error) {
        console.error('Caught error in history device query:', error);
        dispatch(setSessions([]));
        dispatch(setDataSynced());
      });
      // SWM
    } else if (activeDeviceType === 'METER') {
      return dispatch(QueryActions.queryMeterHistory({
        time: time,
        userKey: getState().user.profile.key
      })).then(function (meterData) {
        dispatch(setSessions(meterData));
        dispatch(setDataSynced());
      }).catch(function (error) {
        console.error('Caught error in history meter query:', error);
        dispatch(setSessions([]));
        dispatch(setDataSynced());
      }).then(function () {
        return getState().section.history.mode === 'wateriq' ? dispatch(fetchWaterIQData()) : Promise.resolve();
      }).then(function () {
        return getState().section.history.forecasting ? dispatch(fetchForecastData()) : Promise.resolve();
      }).then(function () {
        return dispatch(fetchComparisonData());
      });
    }
    return Promise.resolve();
  };
};

var enableForecasting = function enableForecasting() {
  return {
    type: types.HISTORY_SET_FORECASTING,
    enable: true
  };
};

var disableForecasting = function disableForecasting() {
  return {
    type: types.HISTORY_SET_FORECASTING,
    enable: false
  };
};

var enablePricing = function enablePricing() {
  return {
    type: types.HISTORY_SET_PRICING,
    enable: true
  };
};

var disablePricing = function disablePricing() {
  return {
    type: types.HISTORY_SET_PRICING,
    enable: false
  };
};

/**
 * Resets active session to null. 
 */
var resetActiveSession = function resetActiveSession() {
  return {
    type: types.HISTORY_RESET_ACTIVE_SESSION
  };
};

/**
 * Sets metric filter for history section. 
 *
 * @param {String} filter - metric filter 
 */
var setMetricFilter = function setMetricFilter(filter) {
  return {
    type: types.HISTORY_SET_FILTER,
    filter: filter
  };
};

var setShowerIndex = function setShowerIndex(index) {
  return {
    type: types.HISTORY_SET_SHOWER_INDEX,
    index: index
  };
};

var switchMemberFilter = function switchMemberFilter(filter) {
  return function (dispatch, getState) {
    dispatch(resetComparisons());
    dispatch(setShowerIndex(0));
    dispatch(setMemberFilter(filter));
  };
};

/**
 * Sets time/period filter for history section. 
 *
 * @param {String} filter - time/period filter 
 */
var setTimeFilter = function setTimeFilter(filter) {
  return function (dispatch, getState) {
    dispatch({
      type: types.HISTORY_SET_TIME_FILTER,
      filter: filter
    });
    if (PERIODS.AMPHIRO.map(function (p) {
      return p.id;
    }).includes(filter)) {
      dispatch(setShowerIndex(0));
    }
  };
};

/**
 * Sets session metric filter for active session in history section. 
 *
 * @param {String} filter - session metric filter 
 */
var setSessionFilter = function setSessionFilter(filter) {
  return {
    type: types.HISTORY_SET_SESSION_FILTER,
    filter: filter
  };
};

/**
* Sets sort filter for sessions list in history section. 
*
* @param {String} filter - session list sort filter 
*/
var setSortFilter = function setSortFilter(filter) {
  return {
    type: types.HISTORY_SET_SORT_FILTER,
    filter: filter
  };
};

/**
* Sets sort order for sessions list in history section. 
*
* @param {String} order - session list order. One of asc, desc 
*/
var setSortOrder = function setSortOrder(order) {
  if (order !== 'asc' && order !== 'desc') throw new Error('order must be asc or desc');
  return {
    type: types.HISTORY_SET_SORT_ORDER,
    order: order
  };
};

/**
 * Sets active devices. 
 *
 * @param {Array} deviceKey - Device keys to set active. 
 *  Important: Device keys must only be of one deviceType (METER or AMPHIRO)  
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */
var setActiveDevice = function setActiveDevice(deviceKey) {
  return {
    type: types.HISTORY_SET_ACTIVE_DEVICE,
    deviceKey: Array.isArray(deviceKey) ? deviceKey : [deviceKey]
  };
};

/**
 * Sets active time window in history section
 *
 * @param {Object} time - Active time window
 * @param {Number} time.startDate - Start timestamp 
 * @param {Number} time.endDate - End timestamp
 * @param {Number} time.granularity - Granularity for data aggregation. 
 * One of 0: minute, 1: hour, 2: day, 3: week, 4: month
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */

var setTime = function setTime(time) {
  return {
    type: types.HISTORY_SET_TIME,
    time: time
  };
};

var setMode = function setMode(mode) {
  return {
    type: types.HISTORY_SET_MODE,
    mode: mode
  };
};

var switchMode = function switchMode(mode) {
  return function (dispatch, getState) {
    dispatch(setMode(mode));
    dispatch(disableForecasting());
    dispatch(disablePricing());
    if (mode === 'pricing') {
      dispatch(enablePricing());
      dispatch(setSortOrder('asc'));
      dispatch(setSortFilter('timestamp'));
      dispatch(setMetricFilter('total'));
      if (getState().section.history.timeFilter !== 'month') {
        dispatch(setTimeFilter('month'));
        dispatch(setTime(getTimeByPeriod('month')));
      }
    } else if (mode === 'forecasting') {
      dispatch(setSortOrder('desc'));
      dispatch(enableForecasting());
      dispatch(setMetricFilter('volume'));
    } else if (mode === 'breakdown') {
      dispatch(setSortOrder('desc'));
      dispatch(setMetricFilter('volume'));
      getState().section.history.comparisons.forEach(function (c) {
        if (c.id !== 'last') {
          dispatch(removeComparison(c.id));
        }
      });
      dispatch(setSortFilter('volume'));
      if (getState().section.history.timeFilter === 'day' || getState().section.history.timeFilter === 'custom') {
        dispatch(setTimeFilter('month'));
        dispatch(setTime(getTimeByPeriod('month')));
      }
    } else if (mode === 'wateriq') {
      dispatch(setSortOrder('desc'));
      dispatch(setMetricFilter('volume'));
      dispatch(resetComparisons());
      dispatch(setTimeFilter('year'));
      dispatch(setTime(getTimeByPeriod('year')));
    } else if (mode === 'stats') {
      dispatch(setSortOrder('desc'));
      dispatch(setMetricFilter('volume'));
    }
  };
};
var setActiveDeviceType = function setActiveDeviceType(deviceType) {
  return {
    type: types.HISTORY_SET_ACTIVE_DEVICE_TYPE,
    deviceType: deviceType
  };
};

/**
 * Sets active device type. 
 * All available devices of selected type are activated 
 * and default values are provided for deviceType dependent filters
 *
 * @param {Array} deviceType - Active device type. One of AMPHIRO, METER  
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */
var switchActiveDeviceType = function switchActiveDeviceType(deviceType) {
  return function (dispatch, getState) {
    dispatch(setActiveDeviceType(deviceType));
    var devices = getDeviceKeysByType(getState().user.profile.devices, deviceType);
    dispatch(setActiveDevice(devices, false));

    // set default options when switching
    // TODO: reset with action to initial state
    if (deviceType === 'AMPHIRO') {
      dispatch(setMetricFilter('volume'));
      dispatch(switchMode('stats'));
      dispatch(setTimeFilter('ten'));
      dispatch(setSortFilter('id'));
      dispatch(setShowerIndex(0));
      dispatch(resetComparisons());
    } else if (deviceType === 'METER') {
      dispatch(setMetricFilter('volume'));
      dispatch(setTimeFilter('month'));
      dispatch(setTime(getTimeByPeriod('month')));
      dispatch(setSortFilter('timestamp'));
      dispatch(resetComparisons());
    }
  };
};

/**
 * Fetches device session (uniquely defined by deviceKey, id) and updates history data
 *
 * @param {Number} id - Session id to fetch 
 * @param {String} deviceKey - Device key session id corresponds to
 * @return {Promise} Resolved or rejected promise with session data if resolved, errors if rejected
 */
var fetchDeviceSession = function fetchDeviceSession(id, deviceKey) {
  return function (dispatch, getState) {
    var devFound = getState().section.history.data.find(function (d) {
      return d.deviceKey === deviceKey;
    });

    var sessions = devFound ? devFound.sessions : [];
    var found = getSessionById(sessions, id);

    if (found && found.measurements) {
      return Promise.resolve();
    }

    return dispatch(QueryActions.fetchDeviceSession({ id: id, deviceKey: deviceKey })).then(function (session) {
      dispatch(setSession(_extends({}, session, { deviceKey: deviceKey })));
      return session;
    }).catch(function (error) {
      console.error('error fetching sesssion', error);
    });
  };
};

/**
 * Sets active session by either deviceKey & id, or by timestamp. 
 * Device key and id are provided for unique sessions (for deviceType AMPHIRO)
 * Timestamp is used as unique identifier for aggragated sessions (for deviceType METER)
 *
 * @param {String} deviceKey - device key for unique session
 * @param {Number} id - id for unique session
 * @param {Number} timestamp - timestamp for aggragated session
 */
var setActiveSession = function setActiveSession(deviceKey, id, timestamp) {
  return function (dispatch, getState) {
    dispatch({
      type: types.HISTORY_SET_ACTIVE_SESSION,
      device: deviceKey,
      id: id || timestamp
    });
    if (id != null && deviceKey != null) {
      dispatch(fetchDeviceSession(id, deviceKey)).then(function (session) {
        if (session) {
          dispatch(setForm('shower', { time: session.timestamp }));
        }
      });
    }
  };
};

/**
 * Updates active time window in history section
 * Same as setTime, only without providing granularity 
 * which is computed based on difference between startDate, endDate
 * See {@link setTime}
 */
var updateTime = function updateTime(time) {
  return function (dispatch, getState) {
    var stateTime = getState().section.history.time;
    var _time$startDate = time.startDate,
        startDate = _time$startDate === undefined ? stateTime.startDate : _time$startDate,
        _time$endDate = time.endDate,
        endDate = _time$endDate === undefined ? stateTime.endDate : _time$endDate,
        _time$granularity = time.granularity,
        granularity = _time$granularity === undefined ? getGranularityByDiff(startDate, endDate) : _time$granularity;


    dispatch(setTime({ startDate: startDate, endDate: endDate, granularity: granularity }));
  };
};

var increaseShowerIndex = function increaseShowerIndex() {
  return function (dispatch, getState) {
    var index = getState().section.history.showerIndex;
    if (hasShowersAfter(index)) {
      dispatch(setShowerIndex(index + 1));
    }
  };
};

var decreaseShowerIndex = function decreaseShowerIndex() {
  return function (dispatch, getState) {
    var index = getState().section.history.showerIndex;
    if (hasShowersBefore(getState().section.history.data)) {
      dispatch(setShowerIndex(index - 1));
    }
  };
};

/**
 * Updates all history options provided
 *
 * TODO: needs update
 *
 * @param {Object} options - Contains all needed options for history
 * @param {String} options.deviceType - Active device type. One of AMPHIRO, METER
 * @param {Array} options.device - Array of device keys to limit active devices 
 * (if not provided all devices are active)
 * @param {String} options.metric - Active metric filter. If METER difference, 
 * if AMPHIRO volume, energy, temperature, duration
 * @param {String} options.period - Active period.
 * For METER one of day, week, month, year, custom (time-based),
 * for AMPHIRO one of ten, twenty, fifty (index-based)
 * @param {Object} options.time - Active time window
 * @param {Number} options.time.startDate - Start timestamp 
 * @param {Number} options.time.endDate - End timestamp
 * @param {Number} options.time.granularity - Granularity for data aggregation. 
 * One of 0: minute, 1: hour, 2: day, 3: week, 4: month
 * @param {Number} options.showerId - The active session id. Together with device indicates 
 * unique session to set active (device array must only have one entry)
 * @param {Object} options.data - If provided data will be copied to history section. 
 * Used to avoid extra fetch
 */
var setQuery = function setQuery(query) {
  return function (dispatch, getState) {
    var active = query.active,
        showerId = query.showerId,
        device = query.device,
        deviceType = query.deviceType,
        metric = query.metric,
        sessionMetric = query.sessionMetric,
        period = query.period,
        time = query.time,
        increaseIndex = query.increaseShowerIndex,
        decreaseIndex = query.decreaseShowerIndex,
        comparisons = query.comparisons,
        clearComparisons = query.clearComparisons,
        data = query.data,
        forecastData = query.forecastData,
        comparisonData = query.comparisonData,
        waterIQData = query.waterIQData,
        memberFilter = query.memberFilter,
        mode = query.mode;


    dispatch(setDataUnsynced());

    if (mode) dispatch(switchMode(mode));
    if (deviceType) dispatch(switchActiveDeviceType(deviceType));
    if (device) dispatch(setActiveDevice(device));
    if (metric) dispatch(setMetricFilter(metric));
    if (sessionMetric) dispatch(setSessionFilter(sessionMetric));
    if (period) dispatch(setTimeFilter(period));
    if (time) dispatch(updateTime(time));
    if (increaseIndex === true) dispatch(increaseShowerIndex());
    if (decreaseIndex === true) dispatch(decreaseShowerIndex());

    if (memberFilter != null) dispatch(switchMemberFilter(memberFilter));

    if (Array.isArray(comparisons)) {
      comparisons.forEach(function (comparison) {
        if (getState().section.history.comparisons.find(function (c) {
          return c.id === comparison;
        })) {
          dispatch(removeComparison(comparison));
        } else if (comparison != null) {
          dispatch(addComparison(comparison));
        }
      });
    } else if (clearComparisons) {
      dispatch(resetComparisons());
    }

    if (Array.isArray(active) && active.length === 2 && active[0] != null && active[1] != null) {
      //dispatch(setActiveSession(Array.isArray(device) ? device[0] : device, showerId)); 
      dispatch(setActiveSession(active[0], active[1]));
    } else if (active === null) {
      dispatch(resetActiveSession());
    }
    if (comparisonData) {
      dispatch(setComparisons(comparisonData));
    }
    /*
    if (waterIQData) {
      dispatch(setWaterIQSessions(waterIQData));
    }
    if (forecastData) {
      dispatch(setForecastData(forecastData));
      }
     if (data && Array.isArray(data)) { 
      dispatch(setSessions(data));
      dispatch(setDataSynced());
      } 
    */
  };
};
var setQueryAndFetch = function setQueryAndFetch(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(fetchData());
  };
};

var fetchAndSetQuery = function fetchAndSetQuery(query) {
  return function (dispatch, getState) {
    dispatch(fetchData()).then(function () {
      return dispatch(setQuery(query));
    });
  };
};

var linkToHistory = function linkToHistory(options) {
  return function (dispatch, getState) {
    dispatch(setQuery(options));
    dispatch(push('/history'));
  };
};

var setPriceBrackets = function setPriceBrackets(brackets) {
  return {
    type: types.HISTORY_SET_PRICE_BRACKETS,
    brackets: brackets
  };
};

var initPriceBrackets = function initPriceBrackets() {
  return function (dispatch, getState) {
    dispatch(QueryActions.fetchPriceBrackets()).then(function (brackets) {
      return dispatch(setPriceBrackets(brackets));
    });
  };
};

var setBreakdownLabels = function setBreakdownLabels(labels) {
  return {
    type: types.HISTORY_SET_BREAKDOWN_LABELS,
    labels: labels
  };
};

var initWaterBreakdown = function initWaterBreakdown() {
  return function (dispatch, getState) {
    dispatch(QueryActions.fetchWaterBreakdown()).then(function (labels) {
      return labels.reverse();
    }).then(function (labels) {
      return dispatch(setBreakdownLabels(labels));
    });
  };
};

module.exports = {
  linkToHistory: linkToHistory,
  fetchDeviceSession: fetchDeviceSession,
  fetchData: fetchData,
  setTime: setTime,
  updateTime: updateTime,
  setComparisons: setComparisons,
  resetComparisons: resetComparisons,
  //addComparison,
  //removeComparison,
  setActiveDevice: setActiveDevice,
  switchActiveDeviceType: switchActiveDeviceType,
  setActiveSession: setActiveSession,
  resetActiveSession: resetActiveSession,
  setMetricFilter: setMetricFilter,
  setTimeFilter: setTimeFilter,
  setSessionFilter: setSessionFilter,
  setSortFilter: setSortFilter,
  setSortOrder: setSortOrder,
  setShowerIndex: setShowerIndex,
  increaseShowerIndex: increaseShowerIndex,
  decreaseShowerIndex: decreaseShowerIndex,
  enableForecasting: enableForecasting,
  disableForecasting: disableForecasting,
  enablePricing: enablePricing,
  disablePricing: disablePricing,
  setQueryAndFetch: setQueryAndFetch,
  fetchAndSetQuery: fetchAndSetQuery,
  enableEditShower: enableEditShower,
  disableEditShower: disableEditShower,
  setMemberFilter: setMemberFilter,
  setDataSynced: setDataSynced,
  setDataUnsynced: setDataUnsynced,
  initPriceBrackets: initPriceBrackets,
  initWaterBreakdown: initWaterBreakdown
};