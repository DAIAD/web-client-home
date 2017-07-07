'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var _require = require('react-router-redux'),
    push = _require.push;

var ReactGA = require('react-ga');

var _require2 = require('./FormActions'),
    setForm = _require2.setForm,
    resetForm = _require2.resetForm;

var _require3 = require('./QueryActions'),
    requestedQuery = _require3.requestedQuery,
    receivedQuery = _require3.receivedQuery,
    setError = _require3.setError,
    setSuccess = _require3.setSuccess,
    resetSuccess = _require3.resetSuccess;

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

var _require8 = require('./FormActions'),
    setConfirm = _require8.setConfirm,
    resetConfirm = _require8.resetConfirm;

var QueryActions = require('./QueryActions');
var CommonsActions = require('./CommonsActions');

var _require9 = require('../constants/HomeConstants'),
    COMMONS_SEARCH_PAGE = _require9.COMMONS_SEARCH_PAGE,
    SUCCESS_SHOW_TIMEOUT = _require9.SUCCESS_SHOW_TIMEOUT;

var setSearchFilter = function setSearchFilter(filter) {
  return {
    type: types.COMMONS_SET_SEARCH_FILTER,
    filter: filter
  };
};

var setSearchPagingIndex = function setSearchPagingIndex(index) {
  return {
    type: types.COMMONS_SET_SEARCH_PAGING_INDEX,
    index: index
  };
};

var setSearchCount = function setSearchCount(count) {
  return {
    type: types.COMMONS_SET_SEARCH_COUNT,
    count: count
  };
};

var setAllCommons = function setAllCommons(commons) {
  return {
    type: types.COMMONS_SET_ALL,
    commons: commons
  };
};

var setAllCommonsSynced = function setAllCommonsSynced() {
  return {
    type: types.COMMONS_SET_ALL_SYNCED
  };
};

var setAllCommonsUnsynced = function setAllCommonsUnsynced() {
  return {
    type: types.COMMONS_SET_ALL_UNSYNCED
  };
};

var setFavorite = function setFavorite(key) {
  return {
    type: types.COMMONS_SET_FAVORITE,
    key: key
  };
};

var searchCommons = function searchCommons() {
  var thunk = function thunk(dispatch, getState) {
    var _getState$section$set = getState().section.settings.commons,
        pageIndex = _getState$section$set.pagingIndex,
        name = _getState$section$set.searchFilter;


    var data = {
      query: {
        name: name,
        sortBy: 'NAME',
        sortAscending: true,
        pageIndex: pageIndex,
        pageSize: COMMONS_SEARCH_PAGE
      },
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return commonsAPI.searchCommons(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      return response;
    }).then(function (response) {
      dispatch(setSearchCount(response.count));
      dispatch(setAllCommonsSynced());
      var commons = flattenCommonsGroups(response.groups);
      dispatch(setAllCommons(commons));
    }).catch(function (error) {
      console.error('caught error in search commons: ', error);
      dispatch(setError(error));
    });
  };
  thunk.meta = {
    debounce: {
      time: 300,
      key: 'COMMONS_SEARCH'
    }
  };
  return thunk;
};

var setCommonsQueryAndFetch = function setCommonsQueryAndFetch(query) {
  return function (dispatch, getState) {
    if (!query) return;
    var name = query.name,
        index = query.index,
        sortBy = query.sortBy,
        sortOrder = query.sortOrder;


    if (index != null) dispatch(setSearchPagingIndex(index));

    if (name != null) {
      dispatch(setSearchFilter(name));
      // if not first page make sure it is reset
      if (getState().section.settings.commons.pagingIndex !== 0) {
        dispatch(setSearchPagingIndex(0));
      }
    }
    //if (sortBy != null) dispatch(setMemberSortFilter(sortBy));
    //if (sortOrder != null) dispatch(setMemberSortOrder(sortOrder));

    dispatch(searchCommons());
  };
};

/* Commons management actions */

var createCommon = function createCommon(common) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = _extends({}, common, {
      csrf: getState().user.csrf
    });

    return commonsAPI.createCommon(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }
      ReactGA.event({
        category: 'commons',
        action: 'created',
        label: common.name
      });

      dispatch(setSuccess());
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }).then(function (response) {
      dispatch(CommonsActions.getMyCommons());
    }).catch(function (error) {
      console.error('caught error in create common: ', error);
      dispatch(setError(error));
    });
  };
};

var updateCommon = function updateCommon(common) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = _extends({}, common, {
      csrf: getState().user.csrf
    });

    return commonsAPI.updateCommon(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      ReactGA.event({
        category: 'commons',
        action: 'updated'
      });
      dispatch(setSuccess());
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }).then(function (response) {
      dispatch(CommonsActions.getMyCommons());
    }).catch(function (error) {
      console.error('caught error in update common: ', error);
      dispatch(setError(error));
    });
  };
};

var deleteCommon = function deleteCommon(key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = {
      key: key,
      csrf: getState().user.csrf
    };

    return commonsAPI.deleteCommon(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }
      ReactGA.event({
        category: 'commons',
        action: 'deleted'
      });

      dispatch(setSuccess());
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }).then(function (response) {
      dispatch(CommonsActions.getMyCommons());
    }).catch(function (error) {
      console.error('caught error in delete common: ', error);
      dispatch(setError(error));
    });
  };
};

var joinCommon = function joinCommon(key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = {
      key: key,
      csrf: getState().user.csrf
    };

    return commonsAPI.joinCommon(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      ReactGA.event({
        category: 'commons',
        action: 'joined'
      });
      dispatch(setSuccess());
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }).then(function (response) {
      dispatch(CommonsActions.getMyCommons());
    }).catch(function (error) {
      console.error('caught error in join common: ', error);
      dispatch(setError(error));
    });
  };
};

var leaveCommon = function leaveCommon(key) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var data = {
      key: key,
      csrf: getState().user.csrf
    };

    return commonsAPI.leaveCommon(data).then(function (response) {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      ReactGA.event({
        category: 'commons',
        action: 'left'
      });
      dispatch(setSuccess());
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }).then(function (response) {
      dispatch(CommonsActions.getMyCommons());
    }).catch(function (error) {
      console.error('caught error in leave common: ', error);
      dispatch(setError(error));
    });
  };
};

var clickConfirmCommon = function clickConfirmCommon() {
  return function (dispatch, getState) {
    var _getState$forms$confi = getState().forms.confirm,
        mode = _getState$forms$confi.mode,
        common = _getState$forms$confi.item;


    if (mode === 'create') {
      dispatch(createCommon(common)).then(function () {
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
      dispatch(joinCommon(common.key)).then(function () {
        dispatch(CommonsActions.setActive(common.key));
        dispatch(push('/settings/commons/'));
      });
    } else {
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    dispatch(resetConfirm());
  };
};

module.exports = {
  //commons management
  setAllCommons: setAllCommons,
  joinCommon: joinCommon,
  leaveCommon: leaveCommon,
  createCommon: createCommon,
  updateCommon: updateCommon,
  deleteCommon: deleteCommon,
  //confirmations
  clickConfirmCommon: clickConfirmCommon,
  setSearchFilter: setSearchFilter,
  setSearchPagingIndex: setSearchPagingIndex,
  //fetch actions
  searchCommons: searchCommons,
  setFavorite: setFavorite,
  setCommonsQueryAndFetch: setCommonsQueryAndFetch
};