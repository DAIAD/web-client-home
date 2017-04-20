'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-intl'),
    injectIntl = _require3.injectIntl;

var _require4 = require('react-router-redux'),
    push = _require4.push;

//const CommonsActions = require('../actions/CommonsActions');


var _require5 = require('../actions/HistoryActions'),
    setHistoryDataUnsynced = _require5.setDataUnsynced;

var CommonsManageActions = require('../actions/CommonsManageActions');
var MembersManageActions = require('../actions/MembersManageActions');

var _require6 = require('../actions/LocaleActions'),
    setLocale = _require6.setLocale;

var _require7 = require('../actions/UserActions'),
    saveToProfile = _require7.saveToProfile,
    saveConfiguration = _require7.saveConfiguration,
    fetchProfile = _require7.fetchProfile,
    changePassword = _require7.changePassword,
    setChangePassword = _require7.setChangePassword,
    resetChangePassword = _require7.resetChangePassword,
    updateDevice = _require7.updateDevice,
    addMember = _require7.addMember,
    editMember = _require7.editMember,
    removeMember = _require7.removeMember;

var _require8 = require('../actions/FormActions'),
    setForm = _require8.setForm,
    resetForm = _require8.resetForm,
    setConfirm = _require8.setConfirm,
    resetConfirm = _require8.resetConfirm;

var _require9 = require('../actions/QueryActions'),
    setError = _require9.setError,
    dismissError = _require9.dismissError;

var Settings = require('../components/sections/settings/');

var _require10 = require('../utils/general'),
    getAllMembers = _require10.getAllMembers,
    formatMessage = _require10.formatMessage;

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return _extends({
    errors: state.query.errors,
    locale: state.locale.locale,
    devices: state.user.profile.devices,
    members: state.user.profile.household.members,
    profileForm: state.forms.profileForm,
    memberForm: state.forms.memberForm,
    deviceForm: state.forms.deviceForm,
    myCommons: state.section.commons.myCommons,
    commonForm: state.forms.commonForm,
    confirm: state.forms.confirm,
    showChangePassword: state.section.settings.profile.showChangePassword
  }, state.section.settings.members, state.section.settings.commons);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, CommonsManageActions, MembersManageActions, {
    setLocale: setLocale,
    setForm: setForm,
    resetForm: resetForm,
    saveToProfile: saveToProfile,
    saveConfiguration: saveConfiguration,
    fetchProfile: fetchProfile,
    changePassword: changePassword,
    setChangePassword: setChangePassword,
    resetChangePassword: resetChangePassword,
    setError: setError,
    dismissError: dismissError,
    setConfirm: setConfirm,
    resetConfirm: resetConfirm,
    setHistoryDataUnsynced: setHistoryDataUnsynced,
    goTo: function goTo(route) {
      return push(route);
    },
    updateDevice: updateDevice
  }), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, stateProps, {
    actions: _extends({}, dispatchProps, {
      //profile
      updateProfileForm: function updateProfileForm(data) {
        return dispatchProps.setForm('profileForm', data);
      },
      resetChangePassword: function resetChangePassword() {
        dispatchProps.resetChangePassword();
        dispatchProps.setForm('profileForm', { password: null, confirmPassword: null });
      },
      //members
      updateMemberForm: function updateMemberForm(data) {
        return dispatchProps.setForm('memberForm', data);
      },
      clearMemberForm: function clearMemberForm() {
        return dispatchProps.resetForm('memberForm');
      },
      confirmAddMember: function confirmAddMember() {
        return dispatchProps.setConfirm('create', stateProps.memberForm);
      },
      confirmEditMember: function confirmEditMember() {
        return dispatchProps.setConfirm('update', stateProps.memberForm);
      },
      confirmDeleteMember: function confirmDeleteMember() {
        return dispatchProps.setConfirm('delete', stateProps.memberForm);
      },
      //devices
      updateDeviceForm: function updateDeviceForm(data) {
        return dispatchProps.setForm('deviceForm', data);
      },
      //commons    
      updateCommonForm: function updateCommonForm(common) {
        return dispatchProps.setForm('commonForm', common);
      },
      clearCommonForm: function clearCommonForm() {
        return dispatchProps.resetForm('commonForm');
      },
      searchCommons: function searchCommons() {
        dispatchProps.searchCommons({ name: stateProps.searchFilter });
        dispatchProps.resetForm('commonForm');
      },
      confirmCreateCommon: function confirmCreateCommon() {
        return dispatchProps.setConfirm('create', stateProps.commonForm);
      },
      confirmUpdateCommon: function confirmUpdateCommon() {
        return dispatchProps.setConfirm('update', stateProps.commonForm);
      },
      confirmDeleteCommon: function confirmDeleteCommon() {
        return dispatchProps.setConfirm('delete', stateProps.commonForm);
      },
      confirmJoinCommon: function confirmJoinCommon() {
        return dispatchProps.setConfirm('join', stateProps.commonForm);
      },
      confirmLeaveCommon: function confirmLeaveCommon() {
        return dispatchProps.setConfirm('leave', stateProps.commonForm);
      },
      saveFavoriteCommon: function saveFavoriteCommon(key) {
        dispatchProps.setFavorite(key);
        dispatchProps.saveConfiguration({ favoriteCommon: key });
        dispatchProps.setHistoryDataUnsynced();
      }
    })
  }, ownProps, {
    members: getAllMembers(stateProps.members),
    pagingIndex: stateProps.pagingIndex + 1, // 1-based
    _t: formatMessage(ownProps.intl)
  });
}

var SettingsData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Settings));
module.exports = SettingsData;