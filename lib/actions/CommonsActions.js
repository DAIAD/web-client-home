'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Commons Actions module.
 * Action creators for Commons section
 * 
 * @module CommonsActions
 */

var ReactGA = require('react-ga');
var types = require('../constants/ActionTypes');
var moment = require('moment');

var _require = require('react-router-redux'),
    push = _require.push;

var _require2 = require('./FormActions'),
    setForm = _require2.setForm,
    resetForm = _require2.resetForm;

var _require3 = require('./QueryActions'),
    requestedQuery = _require3.requestedQuery,
    receivedQuery = _require3.receivedQuery,
    setError = _require3.setError;

var commonsAPI = require('../api/commons');

var _require4 = require('../utils/device'),
    getDeviceKeysByType = _require4.getDeviceKeysByType;

var _require5 = require('../utils/time'),
    getTimeByPeriod = _require5.getTimeByPeriod,
    getPreviousPeriod = _require5.getPreviousPeriod,
    getGranularityByDiff = _require5.getGranularityByDiff;

var _require6 = require('../utils/general'),
    showerFilterToLength = _require6.showerFilterToLength,
    throwServerError = _require6.throwServerError;

var _require7 = require('../utils/commons'),
    flattenCommonsGroups = _require7.flattenCommonsGroups;

var QueryActions = require('./QueryActions');

var _require8 = require('../constants/HomeConstants'),
    COMMONS_MEMBERS_PAGE = _require8.COMMONS_MEMBERS_PAGE;

var setSessions = function setSessions(sessions) {
  return {
    type: types.COMMONS_SET_SESSIONS,
    sessions: sessions
  };
};

var appendSessions = function appendSessions(sessions) {
  return {
    type: types.COMMONS_APPEND_SESSIONS,
    sessions: sessions
  };
};

var setDataSynced = function setDataSynced() {
  return {
    type: types.COMMONS_SET_DATA_SYNCED
  };
};

var setDataUnsynced = function setDataUnsynced() {
  return {
    type: types.COMMONS_SET_DATA_UNSYNCED
  };
};

/**
 * Sets metric filter for commons section. 
 *
 * @param {String} filter - metric filter 
 */
var setMetricFilter = function setMetricFilter(filter) {
  return {
    type: types.COMMONS_SET_FILTER,
    filter: filter
  };
};

/**
 * Sets time/period filter for commons section. 
 *
 * @param {String} filter - time/period filter 
 */
var setTimeFilter = function setTimeFilter(filter) {
  return {
    type: types.COMMONS_SET_TIME_FILTER,
    filter: filter
  };
};

/**
 * Sets active time window in commons section
 *
 * @param {Object} time - Active time window
 * @param {Number} time.startDate - Start timestamp 
 * @param {Number} time.endDate - End timestamp
 * @param {Number} time.granularity - Granularity for data aggregation. 
 * One of 0: minute, 1: hour, 2: day, 3: week, 4: month
 */
var setTime = function setTime(time) {
  return {
    type: types.COMMONS_SET_TIME,
    time: time
  };
};

/**
 * Sets active device type. 
 * All available devices of selected type are activated 
 * and default values are provided for deviceType dependent filters
 *
 * @param {Array} deviceType - Active device type. One of AMPHIRO, METER  
 */
var setActiveDeviceType = function setActiveDeviceType(deviceType) {
  return {
    type: types.COMMONS_SET_ACTIVE_DEVICE_TYPE,
    deviceType: deviceType
  };
};

/**
 * Updates active time window in commons section
 * Same as setTime, only without providing granularity 
 * which is computed based on difference between startDate, endDate
 * See {@link setTime}
 */
var updateTime = function updateTime(time) {
  return function (dispatch, getState) {
    var stateTime = getState().section.commons.time;
    var _time$startDate = time.startDate,
        startDate = _time$startDate === undefined ? stateTime.startDate : _time$startDate,
        _time$endDate = time.endDate,
        endDate = _time$endDate === undefined ? stateTime.endDate : _time$endDate,
        _time$granularity = time.granularity,
        granularity = _time$granularity === undefined ? getGranularityByDiff(startDate, endDate) : _time$granularity;


    dispatch(setTime({ startDate: startDate, endDate: endDate, granularity: granularity }));
  };
};

var setSelectedMembers = function setSelectedMembers(members) {
  return {
    type: types.COMMONS_SET_SELECTED_MEMBERS,
    members: members
  };
};

var setActive = function setActive(key) {
  return {
    type: types.COMMONS_SET_ACTIVE,
    key: key
  };
};

var setActiveMembers = function setActiveMembers(members) {
  return {
    type: types.COMMONS_SET_ACTIVE_MEMBERS,
    members: members
  };
};

/**
 * Sets sort filter for sessions list in commons section. 
 *
 * @param {String} filter - session list sort filter 
 */
var setMemberSortFilter = function setMemberSortFilter(filter) {
  return {
    type: types.COMMONS_SET_MEMBER_SORT_FILTER,
    filter: filter
  };
};

/**
* Sets sort order for sessions list in commons section. 
*
* @param {String} order - session list order. One of asc, desc 
*/
var setMemberSortOrder = function setMemberSortOrder(order) {
  if (order !== 'asc' && order !== 'desc') throw new Error('order must be asc or desc');
  return {
    type: types.COMMONS_SET_MEMBER_SORT_ORDER,
    order: order
  };
};

var setMemberSearchFilter = function setMemberSearchFilter(filter) {
  return {
    type: types.COMMONS_SET_MEMBER_SEARCH_FILTER,
    filter: filter
  };
};

var setMemberPagingIndex = function setMemberPagingIndex(index) {
  return {
    type: types.COMMONS_SET_MEMBER_PAGING_INDEX,
    index: index
  };
};

var setMemberCount = function setMemberCount(count) {
  return {
    type: types.COMMONS_SET_MEMBER_COUNT,
    count: count
  };
};

var searchCommonMembers = function searchCommonMembers() {
  var thunk = function thunk(dispatch, getState) {
    var _getState$section$com = getState().section.commons,
        myCommons = _getState$section$com.myCommons,
        activeKey = _getState$section$com.activeKey,
        members = _getState$section$com.members;
    var pageIndex = members.pagingIndex,
        sortBy = members.sortFilter,
        sortOrder = members.sortOrder,
        name = members.searchFilter;

    var active = activeKey && myCommons.length > 0 ? myCommons.find(function (common) {
      return common.key === activeKey;
    }) : null;

    if (!active) return Promise.resolve();

    var data = {
      key: active.key,
      query: {
        name: name,
        pageIndex: pageIndex,
        pageSize: COMMONS_MEMBERS_PAGE,
        sortBy: sortBy,
        sortAscending: sortOrder === 'asc'
      },
      csrf: getState().user.csrf
    };
    dispatch(requestedQuery());

    return commonsAPI.getCommonMembers(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      return response;
    }).then(function (response) {
      dispatch(setMemberCount(response.count));
      dispatch(setActiveMembers(response.members));
    }).catch(function (error) {
      console.error('caught error in search commons members: ', error);
      dispatch(setError(error));
    });
  };
  thunk.meta = {
    debounce: {
      time: 300,
      key: 'COMMONS_MEMBER_SEARCH'
    }
  };
  return thunk;
};

var setMemberQueryAndFetch = function setMemberQueryAndFetch(query) {
  return function (dispatch, getState) {
    if (!query) return;
    var name = query.name,
        index = query.index,
        sortBy = query.sortBy,
        sortOrder = query.sortOrder;


    if (name != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member search filter',
        label: name.toString()
      });

      dispatch(setMemberSearchFilter(name));
    }
    if (index != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member page',
        label: index.toString()
      });

      dispatch(setMemberPagingIndex(index));
    }
    if (sortBy != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member sort filter',
        label: sortBy.toString()
      });
      dispatch(setMemberSortFilter(sortBy));
    }
    if (sortOrder != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member sort order',
        label: sortOrder.toString()
      });

      dispatch(setMemberSortOrder(sortOrder));
    }

    if ((name != null || sortBy != null || sortOrder != null) && getState().section.commons.members.pagingIndex !== 0) {
      dispatch(setMemberPagingIndex(0));
    }
    dispatch(searchCommonMembers());
  };
};

/**
 * Performs query based on selected commons section filters and saves data
 */
var fetchData = function fetchData() {
  var thunk = function thunk(dispatch, getState) {
    var _getState$section$com2 = getState().section.commons,
        myCommons = _getState$section$com2.myCommons,
        activeKey = _getState$section$com2.activeKey,
        time = _getState$section$com2.time,
        activeDeviceType = _getState$section$com2.activeDeviceType,
        members = _getState$section$com2.members;
    var selectedMembers = members.selected;

    var active = myCommons.find(function (common) {
      return common.key === activeKey;
    });

    var devType = activeDeviceType === 'AMPHIRO' ? 'AMPHIRO_TIME' : activeDeviceType;
    if (!active) return;

    var common = {
      type: 'GROUP',
      label: active.name,
      group: active.key
    };

    var myself = {
      type: 'USER',
      label: 'common.me',
      users: [getState().user.profile.key]
    };

    var selected = selectedMembers.map(function (user) {
      return {
        type: 'USER',
        label: user.firstname + ' ' + user.lastname,
        users: [user.key]
      };
    });

    var populations = [myself, common].concat(_toConsumableArray(selected));

    dispatch(setSessions([]));

    // serialize query to take advantage of cache (?)
    populations.forEach(function (population) {
      dispatch(QueryActions.queryDataAverage({
        time: time,
        source: activeDeviceType,
        population: [population]
      })).then(function (series) {
        var sessions = series.map(function (s) {
          return {
            label: population.label,
            sessions: s
          };
        });
        dispatch(appendSessions(sessions));
        dispatch(setDataSynced());
      }).catch(function (error) {
        console.error('Caught error in commons data fetch', error);
        dispatch(setError(error));
        dispatch(setDataSynced());
      });
    });
  };

  thunk.meta = {
    debounce: {
      time: 500,
      key: 'COMMONS_FETCH_DATA'
    }
  };
  return thunk;
};

var setQuery = function setQuery(query) {
  return function (dispatch, getState) {
    if (!query) return;
    var period = query.period,
        time = query.time,
        deviceType = query.deviceType,
        active = query.active,
        members = query.members;


    if (period != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set time filter',
        label: period
      });

      dispatch(setTimeFilter(period));
    }

    if (time != null) {
      var timeFilter = period || getState().section.commons.timeFilter;
      ReactGA.event({
        category: 'commons',
        action: 'time change',
        label: timeFilter + ': ' + moment(time.startDate).format('DD/MM/YYYY') + '-' + moment(time.endDate).format('DD/MM/YYYY')
      });
      dispatch(updateTime(time));
    }
    if (deviceType != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set device type',
        label: deviceType
      });
      dispatch(setActiveDeviceType(deviceType));
    }
    if (active != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set active common'
      });
      dispatch(setSelectedMembers([]));
      dispatch(setSessions([]));
      dispatch(setActive(active));

      dispatch(searchCommonMembers());
    }
    if (members != null) dispatch(setSelectedMembers(members));
  };
};

var setDataQueryAndFetch = function setDataQueryAndFetch(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(fetchData());
  };
};

var linkToCommons = function linkToCommons(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(push('commons'));
  };
};

var addMemberToChart = function addMemberToChart(member) {
  return function (dispatch, getState) {
    ReactGA.event({
      category: 'commons',
      action: 'added member to chart',
      label: member.name
    });
    var members = [].concat(_toConsumableArray(getState().section.commons.members.selected), [member]);
    dispatch(setDataQueryAndFetch({ members: members }));
  };
};

var removeMemberFromChart = function removeMemberFromChart(member) {
  return function (dispatch, getState) {
    ReactGA.event({
      category: 'commons',
      action: 'removed member from chart',
      label: member.name
    });
    var members = getState().section.commons.members.selected.filter(function (m) {
      return m.key !== member.key;
    });

    dispatch(setDataQueryAndFetch({ members: members }));
  };
};

var setMyCommons = function setMyCommons(commons) {
  return {
    type: types.COMMONS_SET_MINE,
    commons: commons
  };
};

var getMyCommons = function getMyCommons() {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = {
      csrf: getState().user.csrf
    };

    return commonsAPI.getCommons(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      return response;
    }).then(function (response) {
      var commons = flattenCommonsGroups(response.groups);
      dispatch(setMyCommons(commons));
      return commons;
    }).catch(function (error) {
      console.error('caught error in get commons: ', error);
      dispatch(setError(error));
    });
  };
};

module.exports = {
  setTime: setTime,
  //updateTime,
  setActiveDeviceType: setActiveDeviceType,
  setMetricFilter: setMetricFilter,
  setTimeFilter: setTimeFilter,
  setActive: setActive,
  setMemberSearchFilter: setMemberSearchFilter,
  setMemberSortFilter: setMemberSortFilter,
  setMemberSortOrder: setMemberSortOrder,
  setMemberPagingIndex: setMemberPagingIndex,
  setMemberQueryAndFetch: setMemberQueryAndFetch,
  searchCommonMembers: searchCommonMembers,
  setSelectedMembers: setSelectedMembers,
  addMemberToChart: addMemberToChart,
  removeMemberFromChart: removeMemberFromChart,
  setDataQueryAndFetch: setDataQueryAndFetch,
  fetchData: fetchData,
  getMyCommons: getMyCommons,
  linkToCommons: linkToCommons
};