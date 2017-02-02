/**
 * Commons Actions module.
 * Action creators for Commons section
 * 
 * @module CommonsActions
 */

const types = require('../constants/ActionTypes');
const { push } = require('react-router-redux');
const { setForm, resetForm } = require('./FormActions');
const { getDeviceKeysByType } = require('../utils/device');
const { getTimeByPeriod, getPreviousPeriod, getGranularityByDiff } = require('../utils/time');
const { showerFilterToLength } = require('../utils/general');

const QueryActions = require('./QueryActions');


const setSessions = function (sessions) {
  return {
    type: types.COMMONS_SET_SESSIONS,
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
 * Performs query based on selected commons section filters and saves data
 */
const fetchData = function () {
  return function (dispatch, getState) {
    // AMPHIRO
    if (getState().section.commons.activeDeviceType === 'AMPHIRO') {
      const amphiros = getDeviceKeysByType(getState().user.profile.devices, 'AMPHIRO');


      if (amphiros.length === 0) {
        dispatch(setSessions([]));
        dispatch(setDataSynced());
        return;
      }

      dispatch(QueryActions.queryDeviceSessionsCache({ 
        deviceKey: amphiros, 
        type: 'SLIDING', 
        length: showerFilterToLength(getState().section.commons.timeFilter), 
      }))
      .then(sessions => dispatch(setSessions(sessions)))
      .then(() => dispatch(setDataSynced()))
      .catch((error) => { 
        console.error('Caught error in commons device query:', error); 
        dispatch(setSessions([]));
        dispatch(setDataSynced());
      });
      // SWM
    } else if (getState().section.commons.activeDeviceType === 'METER') {
      const meters = getDeviceKeysByType(getState().user.profile.devices, 'METER');

      dispatch(QueryActions.queryMeterHistoryCache({
        deviceKey: meters, 
        time: getState().section.commons.time, 
      }))
      .then(sessions => dispatch(setSessions(sessions)))
      .then(() => dispatch(setDataSynced()))
      .catch((error) => { 
        console.error('Caught error in commons meter query:', error); 
        dispatch(setSessions([]));
        dispatch(setDataSynced());
      });
    }
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
 * Sets sort filter for sessions list in commons section. 
 *
 * @param {String} filter - session list sort filter 
 */
const setSortFilter = function (filter) {
  return {
    type: types.COMMONS_SET_SORT_FILTER,
    filter,
  };
};

 /**
 * Sets sort order for sessions list in commons section. 
 *
 * @param {String} order - session list order. One of asc, desc 
 */
const setSortOrder = function (order) {
  if (order !== 'asc' && order !== 'desc') throw new Error('order must be asc or desc');
  return {
    type: types.COMMONS_SET_SORT_ORDER,
    order,
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
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */
const setTime = function (time, query = true) {
  return function (dispatch, getState) {
    dispatch({
      type: types.COMMONS_SET_TIME,
      time,
    });
    if (query) { 
      dispatch(setDataUnsynced());
      dispatch(fetchData());
    }
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
const setActiveDeviceType = function (deviceType, query = true) {
  return function (dispatch, getState) {
    dispatch({
      type: types.COMMONS_SET_ACTIVE_DEVICE_TYPE,
      deviceType,
    });
    const devices = getDeviceKeysByType(getState().user.profile.devices, deviceType);
    
    // set default options when switching
    if (deviceType === 'AMPHIRO') {
      dispatch(setMetricFilter('volume'));
      dispatch(setTimeFilter('ten'));
      dispatch(setSortFilter('ranking'));
    } else if (deviceType === 'METER') {
      dispatch(setMetricFilter('difference'));
      dispatch(setTimeFilter('year'));
      dispatch(setTime(getTimeByPeriod('year'), query));
      dispatch(setSortFilter('ranking'));
    }
    
    if (query) { 
      dispatch(setDataUnsynced());
      dispatch(fetchData());
    }
  };
};

/**
 * Updates active time window in commons section
 * Same as setTime, only without providing granularity 
 * which is computed based on difference between startDate, endDate
 * See {@link setTime}
 */
const updateTime = function (time, query = true) {
  return function (dispatch, getState) {
    let { startDate, endDate } = time;
    startDate = startDate || getState().section.commons.time.startDate;
    endDate = endDate || getState().section.commons.time.endDate;

    const granularity = getGranularityByDiff(startDate, endDate);

    dispatch(setTime({ startDate, endDate, granularity }, query));
  };
};

const setSelectedMembers = function (members) {
  return {
    type: types.COMMONS_SET_SELECTED_MEMBERS,
    members,
  };
};

const addMemberToChart = function (member) {
  return function (dispatch, getState) {
    const members = [...getState().section.commons.selectedMembers, member];
    dispatch(setSelectedMembers(members));
  };
};

const removeMemberFromChart = function (member) {
  return function (dispatch, getState) {
    const members = getState().section.commons.selectedMembers
    .filter(m => m.id !== member.id);

    dispatch(setSelectedMembers(members));
  };
};

const setActive = function (id) {
  return {
    type: types.COMMONS_SET_ACTIVE,
    id
  };
};

const switchActive = function (id) {
  return function (dispatch, getState) {
    dispatch(setSelectedMembers([]));
    dispatch(setActive(id));
  };
};

const setAllCommons = function (commons) {
  return {
    type: types.COMMONS_SET_ALL,
    commons,
  };
};

const setMyCommons = function (commons) {
  return {
    type: types.COMMONS_SET_MINE,
    commons,
  };
};

const joinCommon = function (id) {
  return function (dispatch, getState) {
    const { myCommons, allCommons } = getState().section.commons;

    dispatch(setMyCommons([...myCommons, allCommons.find(c => c.id === id)]));
    dispatch(setAllCommons(allCommons.filter(c => c.id !== id)));
  };
};

const leaveCommon = function (id) {
  return function (dispatch, getState) {
    const { myCommons, allCommons } = getState().section.commons;

    dispatch(setAllCommons([...allCommons, myCommons.find(c => c.id === id)]));
    dispatch(setMyCommons(myCommons.filter(c => c.id !== id)));

    if (id === getState().section.commons.active) {
      dispatch(switchActive(null));
    }
  };
};

const createCommon = function (common) {
  return function (dispatch, getState) {
    const { myCommons, allCommons } = getState().section.commons;

    dispatch(setMyCommons([...myCommons, common]));
  };
};

const editCommon = function (common) {
  return function (dispatch, getState) {
    const { myCommons, allCommons } = getState().section.commons;

    dispatch(setMyCommons(myCommons.map(c => c.id === common.id ? { ...c, ...common } : c)));
  };
};

const deleteCommon = function (id) {
  return function (dispatch, getState) {
    const { myCommons, allCommons } = getState().section.commons;
    
    dispatch(setMyCommons(myCommons.filter(c => c.id !== id)));
    if (id === getState().section.commons.active) {
      dispatch(switchActive(null));
    }
  };
};

const resetConfirm = function () {
  return {
    type: types.COMMONS_RESET_CONFIRM,
  };
};

const setConfirm = function (common, mode) {
  return function (dispatch, getState) {
    //dispatch(switchMode('confirm'));
    dispatch({
      type: types.COMMONS_SET_CONFIRM,
      mode,
      common,
    });
  };
};

const clickConfirm = function () {
  return function (dispatch, getState) {
    const confirm = getState().section.commons.confirm;
    if (!confirm) { throw new Error('Oops, confirm clicked without pending confirmation'); }

    const [mode, common] = confirm;

    if (mode === 'leave') {
      dispatch(leaveCommon(common.id));
    } else if (mode === 'join') {
      dispatch(joinCommon(common.id));
      dispatch(switchActive(common.id));
      dispatch(push('/settings/commons/'));
    } else if (mode === 'create') {
      dispatch(createCommon(common));
      dispatch(switchActive(common.id));
      dispatch(push('/settings/commons/'));
    } else if (mode === 'edit') {
      dispatch(editCommon(common));
    } else if (mode === 'delete') {
      dispatch(deleteCommon(common.id));
    } else {
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    dispatch(resetConfirm());
    dispatch(resetForm('editCommon'));
    //dispatch(switchToNormal());
  };
};

const setSearchFilter = function (search) {
  return {
    type: types.COMMONS_SET_SEARCH_FILTER,
    search,
  };
};

const setMemberSearchFilter = function (search) {
  return {
    type: types.COMMONS_SET_MEMBER_SEARCH_FILTER,
    search,
  };
};

module.exports = {
  //explore operations
  fetchData,
  setTime,
  updateTime,
  setActiveDeviceType,
  setMetricFilter,
  setTimeFilter,
  setSortFilter,
  setSortOrder,
  switchActive,
  setSearchFilter,
  setMemberSearchFilter,
  setSelectedMembers,
  addMemberToChart,
  removeMemberFromChart,
  //commons operations
  setAllCommons,
  setMyCommons,
  joinCommon,
  leaveCommon,
  createCommon,
  editCommon,
  deleteCommon,
  //confirmations
  setConfirm,
  clickConfirm,
  resetConfirm,
};
