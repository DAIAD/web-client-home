'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('../constants/ActionTypes');

var _require = require('react-router-redux'),
    push = _require.push;

var _require2 = require('./FormActions'),
    setForm = _require2.setForm,
    resetForm = _require2.resetForm;

var userAPI = require('../api/user');
var dataAPI = require('../api/data');

var _require3 = require('../utils/device'),
    getDeviceKeysByType = _require3.getDeviceKeysByType;

var _require4 = require('../utils/time'),
    getTimeByPeriod = _require4.getTimeByPeriod,
    getPreviousPeriod = _require4.getPreviousPeriod,
    getGranularityByDiff = _require4.getGranularityByDiff;

var _require5 = require('../utils/general'),
    showerFilterToLength = _require5.showerFilterToLength,
    throwServerError = _require5.throwServerError;

var _require6 = require('../utils/commons'),
    flattenCommonsGroups = _require6.flattenCommonsGroups;

var _require7 = require('./FormActions'),
    setConfirm = _require7.setConfirm,
    resetConfirm = _require7.resetConfirm;

var _require8 = require('./QueryActions'),
    resetSuccess = _require8.resetSuccess,
    requestedQuery = _require8.requestedQuery,
    receivedQuery = _require8.receivedQuery,
    dismissError = _require8.dismissError,
    setInfo = _require8.setInfo;

var _require9 = require('./UserActions'),
    fetchProfile = _require9.fetchProfile;

var _require10 = require('../constants/HomeConstants'),
    SUCCESS_SHOW_TIMEOUT = _require10.SUCCESS_SHOW_TIMEOUT;

var saveMembers = function saveMembers(members) {
  return function (dispatch, getState) {
    var data = {
      members: members,
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return userAPI.saveMembers(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);
      }
      return response;
    }).catch(function (errors) {
      console.error('Error caught on saveMembers:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var addMember = function addMember(data) {
  return function (dispatch, getState) {
    var index = data.index;
    var members = getState().user.profile.household.members;


    var lastIndex = Array.isArray(members) && members.length > 0 ? members.map(function (m) {
      return m.index;
    }).reduce(function (p, c) {
      return c > p ? c : p;
    }, 0) : 1;
    var newMembers = [].concat(_toConsumableArray(members), [_extends({}, data, { active: true, index: lastIndex + 1 })]);
    return dispatch(saveMembers(newMembers));
  };
};

var editMember = function editMember(data) {
  return function (dispatch, getState) {
    var index = data.index;
    var members = getState().user.profile.household.members;


    if (!index || index === -1) {
      return dispatch(addMember(data));
    }
    var newMembers = members.map(function (m) {
      return m.index === index ? _extends({}, m, data, { active: true }) : m;
    });

    return dispatch(saveMembers(newMembers));
  };
};

var removeMember = function removeMember(data) {
  return function (dispatch, getState) {
    var index = data.index;
    var members = getState().user.profile.household.members;


    var newMembers = members.filter(function (m) {
      return m.index !== index;
    });
    return dispatch(saveMembers(newMembers));
  };
};

var clickConfirmMember = function clickConfirmMember() {
  return function (dispatch, getState) {
    var _getState$forms$confi = getState().forms.confirm,
        item = _getState$forms$confi.item,
        mode = _getState$forms$confi.mode;


    if (mode === 'create') {
      dispatch(push('/settings/members'));
      dispatch(addMember(item)).then(function () {
        return dispatch(fetchProfile());
      });
    } else if (mode === 'update') {
      dispatch(editMember(item)).then(function () {
        return dispatch(fetchProfile());
      });
    } else if (mode === 'delete') {
      dispatch(removeMember(item)).then(function () {
        return dispatch(fetchProfile());
      });
    } else {
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    dispatch(resetConfirm());
  };
};

module.exports = {
  saveMembers: saveMembers,
  addMember: addMember,
  editMember: editMember,
  removeMember: removeMember,
  //confirm
  clickConfirmMember: clickConfirmMember
};