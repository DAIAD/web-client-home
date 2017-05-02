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

var _require6 = require('../actions/DashboardActions'),
    setWidgetTypeUnsynced = _require6.setWidgetTypeUnsynced;

var CommonsManageActions = require('../actions/CommonsManageActions');
var MembersManageActions = require('../actions/MembersManageActions');

var _require7 = require('../actions/LocaleActions'),
    setLocale = _require7.setLocale;

var _require8 = require('../actions/UserActions'),
    saveToProfile = _require8.saveToProfile,
    saveConfiguration = _require8.saveConfiguration,
    fetchProfile = _require8.fetchProfile,
    changePassword = _require8.changePassword,
    setChangePassword = _require8.setChangePassword,
    resetChangePassword = _require8.resetChangePassword,
    updateDevice = _require8.updateDevice,
    addMember = _require8.addMember,
    editMember = _require8.editMember,
    removeMember = _require8.removeMember;

var _require9 = require('../actions/FormActions'),
    setForm = _require9.setForm,
    resetForm = _require9.resetForm,
    setConfirm = _require9.setConfirm,
    resetConfirm = _require9.resetConfirm;

var _require10 = require('../actions/QueryActions'),
    setError = _require10.setError,
    dismissError = _require10.dismissError;

var Settings = require('../components/sections/settings/');

var _require11 = require('../utils/general'),
    getAllMembers = _require11.getAllMembers,
    formatMessage = _require11.formatMessage;

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
    updateDevice: updateDevice,
    setWidgetTypeUnsynced: setWidgetTypeUnsynced
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
        dispatchProps.setWidgetTypeUnsynced('commons');
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