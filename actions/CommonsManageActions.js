const types = require('../constants/ActionTypes');
const { push } = require('react-router-redux');
const { setForm, resetForm } = require('./FormActions');
const { requestedQuery, receivedQuery, resetSuccess } = require('./QueryActions');
const commonsAPI = require('../api/commons');

const { getDeviceKeysByType } = require('../utils/device');
const { getTimeByPeriod, getPreviousPeriod, getGranularityByDiff } = require('../utils/time');
const { showerFilterToLength, throwServerError } = require('../utils/general');
const { flattenCommonsGroups } = require('../utils/commons');

const QueryActions = require('./QueryActions');
const CommonsActions = require('./CommonsActions');

const { COMMONS_SEARCH_PAGE } = require('../constants/HomeConstants');

const setSearchFilter = function (filter) {
  return {
    type: types.COMMONS_SET_SEARCH_FILTER,
    filter,
  };
};

const setSearchPagingIndex = function (index) {
  return {
    type: types.COMMONS_SET_SEARCH_PAGING_INDEX,
    index,
  };
};

const setSearchCount = function (count) {
  return {
    type: types.COMMONS_SET_SEARCH_COUNT,
    count,
  };
};

const setAllCommons = function (commons) {
  return {
    type: types.COMMONS_SET_ALL,
    commons,
  };
};

const setAllCommonsSynced = function () {
  return {
    type: types.COMMONS_SET_ALL_SYNCED,
  };
};

const setAllCommonsUnsynced = function () {
  return {
    type: types.COMMONS_SET_ALL_UNSYNCED,
  };
};

const searchCommons = function () {
  return function (dispatch, getState) {
    const { pagingIndex: pageIndex, searchFilter: name } = getState().section.settings.commons;

    const data = {
      query: {
        name,
        sortBy: 'NAME',
        sortAscending: true,
        pageIndex,
        pageSize: COMMONS_SEARCH_PAGE,
      },
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());
    return commonsAPI.searchCommons(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(setSearchCount(response.count));
      dispatch(setAllCommonsSynced());
      const commons = flattenCommonsGroups(response.groups);
      dispatch(setAllCommons(commons));
    })
    .catch((error) => {
      console.error('caught error in search commons: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const setCommonsQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    if (!query) return;
    const { name, index, sortBy, sortOrder } = query;
    
    if (name != null) dispatch(setSearchFilter(name));
    if (index != null) dispatch(setSearchPagingIndex(index));
    //if (sortBy != null) dispatch(setMemberSortFilter(sortBy));
    //if (sortOrder != null) dispatch(setMemberSortOrder(sortOrder));

    dispatch(searchCommons());
  };
};

/* Commons management actions */

const createCommon = function (common) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      ...common,
      csrf: getState().user.csrf,
    };

    return commonsAPI.createCommon(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }
      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(CommonsActions.getMyCommons());
    })
    .catch((error) => {
      console.error('caught error in create common: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const updateCommon = function (common) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      ...common,
      csrf: getState().user.csrf,
    };

    return commonsAPI.updateCommon(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(CommonsActions.getMyCommons());
    })
    .catch((error) => {
      console.error('caught error in update common: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const deleteCommon = function (key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      key,
      csrf: getState().user.csrf,
    };

    return commonsAPI.deleteCommon(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(CommonsActions.getMyCommons());
    })
    .catch((error) => {
      console.error('caught error in delete common: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const joinCommon = function (key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      key,
      csrf: getState().user.csrf,
    };

    return commonsAPI.joinCommon(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(CommonsActions.getMyCommons());
    })
    .catch((error) => {
      console.error('caught error in join common: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

const leaveCommon = function (key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const data = {
      key,
      csrf: getState().user.csrf,
    };

    return commonsAPI.leaveCommon(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(receivedQuery(response.success, response.errors));
      dispatch(resetSuccess());

      return response;
    })
    .then((response) => {
      dispatch(CommonsActions.getMyCommons());
    })
    .catch((error) => {
      console.error('caught error in leave common: ', error);
      dispatch(receivedQuery(false, error));
      throw error;
    });
  };
};

/* Confirm actions */

const resetConfirm = function () {
  return {
    type: types.COMMONS_RESET_CONFIRM,
  };
};

const setConfirm = function (common, mode) {
  return function (dispatch, getState) {
    dispatch({
      type: types.COMMONS_SET_CONFIRM,
      mode,
      common,
    });
  };
};

const clickConfirm = function () {
  return function (dispatch, getState) {
    const { confirm } = getState().section.settings.commons;
    if (!confirm) { throw new Error('Oops, confirm clicked without pending confirmation'); }

    const [mode, common] = confirm;

    if (mode === 'create') {
      dispatch(createCommon(common))
      .then(() => {
        dispatch(CommonsActions.setActive(common.key));
        dispatch(setAllCommonsUnsynced());
        dispatch(push('/settings/commons/'));
      });
    } else if (mode === 'update') {
      dispatch(setAllCommonsUnsynced());
      dispatch(updateCommon(common));
    } else if (mode === 'delete') {
      dispatch(setAllCommonsUnsynced());
      dispatch(deleteCommon(common.key));
    } else if (mode === 'leave') {
      dispatch(setAllCommonsUnsynced());
      dispatch(leaveCommon(common.key));
    } else if (mode === 'join') {
      dispatch(setAllCommonsUnsynced());
      dispatch(joinCommon(common.key))
      .then(() => {
        dispatch(CommonsActions.setActive(common.key));
        dispatch(push('/settings/commons/'));
      });
    } else { 
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    dispatch(resetConfirm());
    dispatch(resetForm('updateCommon'));
  };
};


module.exports = {
  //commons management
  setAllCommons,
  joinCommon,
  leaveCommon,
  createCommon,
  updateCommon,
  deleteCommon,
  //confirmations
  setConfirm,
  clickConfirm,
  resetConfirm,
  setSearchFilter,
  setSearchPagingIndex,
  //fetch actions
  searchCommons,
  setCommonsQueryAndFetch,
};
