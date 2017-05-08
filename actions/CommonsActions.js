/**
 * Commons Actions module.
 * Action creators for Commons section
 * 
 * @module CommonsActions
 */

const ReactGA = require('react-ga');
const types = require('../constants/ActionTypes');
const moment = require('moment');
const { push } = require('react-router-redux');
const { setForm, resetForm } = require('./FormActions');
const { requestedQuery, receivedQuery, setError } = require('./QueryActions');
const commonsAPI = require('../api/commons');

const { getDeviceKeysByType } = require('../utils/device');
const { getTimeByPeriod, getPreviousPeriod, getGranularityByDiff } = require('../utils/time');
const { showerFilterToLength, throwServerError } = require('../utils/general');
const { flattenCommonsGroups } = require('../utils/commons');

const QueryActions = require('./QueryActions');

const { COMMONS_MEMBERS_PAGE } = require('../constants/HomeConstants');

const setSessions = function (sessions) {
  return {
    type: types.COMMONS_SET_SESSIONS,
    sessions,
  };
};

const appendSessions = function (sessions) {
  return {
    type: types.COMMONS_APPEND_SESSIONS,
    sessions,
  };
};

const setDataSynced = function () {
  return {
    type: types.COMMONS_SET_DATA_SYNCED,
  };
};

const setDataUnsynced = function () {
  return {
    type: types.COMMONS_SET_DATA_UNSYNCED,
  };
};

/**
 * Sets metric filter for commons section. 
 *
 * @param {String} filter - metric filter 
 */
const setMetricFilter = function (filter) {
  return {
    type: types.COMMONS_SET_FILTER,
    filter,
  };
};

/**
 * Sets time/period filter for commons section. 
 *
 * @param {String} filter - time/period filter 
 */
const setTimeFilter = function (filter) {
  return {
    type: types.COMMONS_SET_TIME_FILTER,
    filter,
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
const setTime = function (time) {
  return {
    type: types.COMMONS_SET_TIME,
    time,
  };
};

/**
 * Sets active device type. 
 * All available devices of selected type are activated 
 * and default values are provided for deviceType dependent filters
 *
 * @param {Array} deviceType - Active device type. One of AMPHIRO, METER  
 */
const setActiveDeviceType = function (deviceType) {
  return {
    type: types.COMMONS_SET_ACTIVE_DEVICE_TYPE,
    deviceType,
  };
};

/**
 * Updates active time window in commons section
 * Same as setTime, only without providing granularity 
 * which is computed based on difference between startDate, endDate
 * See {@link setTime}
 */
const updateTime = function (time) {
  return function (dispatch, getState) {
    const stateTime = getState().section.commons.time;
    const { 
      startDate = stateTime.startDate, 
      endDate = stateTime.endDate, 
        granularity = getGranularityByDiff(startDate, endDate) 
    } = time;

    dispatch(setTime({ startDate, endDate, granularity }));
  };
};

const setSelectedMembers = function (members) {
  return {
    type: types.COMMONS_SET_SELECTED_MEMBERS,
    members,
  };
};

const setActive = function (key) {
  return {
    type: types.COMMONS_SET_ACTIVE,
    key,
  };
};

const setActiveMembers = function (members) {
  return {
    type: types.COMMONS_SET_ACTIVE_MEMBERS,
    members,
  };
};


/**
 * Sets sort filter for sessions list in commons section. 
 *
 * @param {String} filter - session list sort filter 
 */
const setMemberSortFilter = function (filter) {
  return {
    type: types.COMMONS_SET_MEMBER_SORT_FILTER,
    filter,
  };
};

 /**
 * Sets sort order for sessions list in commons section. 
 *
 * @param {String} order - session list order. One of asc, desc 
 */
const setMemberSortOrder = function (order) {
  if (order !== 'asc' && order !== 'desc') throw new Error('order must be asc or desc');
  return {
    type: types.COMMONS_SET_MEMBER_SORT_ORDER,
    order,
  };
};

const setMemberSearchFilter = function (filter) {
  return {
    type: types.COMMONS_SET_MEMBER_SEARCH_FILTER,
    filter,
  };
};

const setMemberPagingIndex = function (index) {
  return {
    type: types.COMMONS_SET_MEMBER_PAGING_INDEX,
    index,
  };
};

const setMemberCount = function (count) {
  return {
    type: types.COMMONS_SET_MEMBER_COUNT,
    count,
  };
};

const searchCommonMembers = function () {
  return function (dispatch, getState) {
    const { myCommons, activeKey, members } = getState().section.commons;
    const { pagingIndex: pageIndex, sortFilter: sortBy, sortOrder, searchFilter: name } = members;
    const active = activeKey && myCommons.length > 0 ? 
      myCommons.find(common => common.key === activeKey) : null;
      
    if (!active) return Promise.resolve();

    const data = {
      key: active.key,
      query: {
        name,
        pageIndex,
        pageSize: COMMONS_MEMBERS_PAGE,
        sortBy,
        sortAscending: sortOrder === 'asc',
      },
      csrf: getState().user.csrf,
    };
    dispatch(requestedQuery());

    return commonsAPI.getCommonMembers(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      return response;
    })
    .then((response) => {
      dispatch(setMemberCount(response.count));
      dispatch(setActiveMembers(response.members));
    })
    .catch((error) => {
      console.error('caught error in search commons members: ', error);
      dispatch(setError(error));
    });
  };
};

const setMemberQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    if (!query) return;
    const { name, index, sortBy, sortOrder } = query;
    
    if (name != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member search filter',
        label: name.toString(),
      });

      dispatch(setMemberSearchFilter(name));
    }
    if (index != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member page',
        label: index.toString(),
      });

      dispatch(setMemberPagingIndex(index));
    }
    if (sortBy != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member sort filter',
        label: sortBy.toString(),
      });
      dispatch(setMemberSortFilter(sortBy));
    }
    if (sortOrder != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set member sort order',
        label: sortOrder.toString(),
      });

      dispatch(setMemberSortOrder(sortOrder));
    }

    dispatch(searchCommonMembers());
  };
};

/**
 * Performs query based on selected commons section filters and saves data
 */
const fetchData = function () {
  return function (dispatch, getState) {
    const { myCommons, activeKey, time, activeDeviceType, members } = getState().section.commons;

    const { selected: selectedMembers } = members;
    const active = myCommons.find(common => common.key === activeKey);

    const devType = activeDeviceType === 'AMPHIRO' ? 'AMPHIRO_TIME' : activeDeviceType;
    if (!active) return;

    const common = {
      type: 'GROUP',
      label: active.name,
      group: active.key,
    };

    const myself = {
      type: 'USER',
      label: 'common.me',
      users: [getState().user.profile.key],
    };

    const selected = selectedMembers.map(user => ({
      type: 'USER',
      label: `${user.firstname} ${user.lastname}`,
      users: [user.key],
    }));

    const populations = [
      myself,
      common,
      ...selected,
    ];

    dispatch(setSessions([]));
    
    // serialize query to take advantage of cache (?)
    populations.forEach((population) => {
      dispatch(QueryActions.queryDataAverage({ 
        time,
        source: activeDeviceType,
        population: [population],
      }))
      .then((series) => { 
        const sessions = series.map(s => ({ 
          label: population.label,
          sessions: s,
        }));
        dispatch(appendSessions(sessions));
        dispatch(setDataSynced());
      })
      .catch((error) => { 
        console.error('Caught error in commons data fetch', error); 
        dispatch(setError(error));
        dispatch(setDataSynced());
      });
    });
  };
};

const setQuery = function (query) {
  return function (dispatch, getState) {
    if (!query) return;
    const { period, time, deviceType, active, members } = query;
    
    if (period != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set time filter',
        label: period,
      });

      dispatch(setTimeFilter(period));
    }

    if (time != null) {
      const timeFilter = period || getState().section.commons.timeFilter;
        ReactGA.event({
          category: 'commons',
          action: 'time change',
          label: `${timeFilter}: ${moment(time.startDate).format('DD/MM/YYYY')}-${moment(time.endDate).format('DD/MM/YYYY')}`,
        });
      dispatch(updateTime(time));
    }
    if (deviceType != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set device type',
        label: deviceType,
      });
      dispatch(setActiveDeviceType(deviceType));
    }
    if (active != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set active common',
      });
      dispatch(setSelectedMembers([]));
      dispatch(setSessions([]));
      dispatch(setActive(active));
      
      dispatch(searchCommonMembers());
    }
    if (members != null) dispatch(setSelectedMembers(members));
  };
};

const setDataQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(fetchData());
  };
};

const linkToCommons = function (query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(push('commons'));
  };
};

const addMemberToChart = function (member) {
  return function (dispatch, getState) {
    ReactGA.event({
      category: 'commons',
      action: 'added member to chart',
      label: member.name
    });
    const members = [...getState().section.commons.members.selected, member];
    dispatch(setDataQueryAndFetch({ members }));
  };
};

const removeMemberFromChart = function (member) {
  return function (dispatch, getState) {
    ReactGA.event({
      category: 'commons',
      action: 'removed member from chart',
      label: member.name
    });
    const members = getState().section.commons.members.selected
    .filter(m => m.key !== member.key);

    dispatch(setDataQueryAndFetch({ members }));
  };
};

const setMyCommons = function (commons) {
  return {
    type: types.COMMONS_SET_MINE,
    commons,
  };
};


const getMyCommons = function () {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      csrf: getState().user.csrf,
    };

    return commonsAPI.getCommons(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      return response;
    })
    .then((response) => {
      const commons = flattenCommonsGroups(response.groups);
      dispatch(setMyCommons(commons));
      return commons;
    })
    .catch((error) => {
      console.error('caught error in get commons: ', error);
      dispatch(setError(error));
    });
  };
};

module.exports = {
  setTime,
  //updateTime,
  setActiveDeviceType,
  setMetricFilter,
  setTimeFilter,
  setActive,
  setMemberSearchFilter,
  setMemberSortFilter,
  setMemberSortOrder,
  setMemberPagingIndex,
  setMemberQueryAndFetch,
  searchCommonMembers, 
  setSelectedMembers,
  addMemberToChart,
  removeMemberFromChart,
  setDataQueryAndFetch,
  fetchData,
  getMyCommons,
  linkToCommons,
};
