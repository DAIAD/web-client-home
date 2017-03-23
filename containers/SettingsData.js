const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

//const CommonsActions = require('../actions/CommonsActions');
const { setDataUnsynced: setHistoryDataUnsynced } = require('../actions/HistoryActions');
const CommonsManageActions = require('../actions/CommonsManageActions');
const MembersManageActions = require('../actions/MembersManageActions');
const { setLocale } = require('../actions/LocaleActions');
const { saveToProfile, saveConfiguration, fetchProfile, changePassword, setChangePassword, resetChangePassword, updateDevice, addMember, editMember, removeMember } = require('../actions/UserActions');
const { setForm, resetForm, setConfirm, resetConfirm } = require('../actions/FormActions');
const { setError, dismissError } = require('../actions/QueryActions');

const Settings = require('../components/sections/settings/');

const { formatMessage } = require('../utils/general');
const { getAllMembers } = require('../utils/sessions');

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return {
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
    showChangePassword: state.section.settings.profile.showChangePassword,
    ...state.section.settings.members,
    ...state.section.settings.commons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...CommonsManageActions,
      ...MembersManageActions,
      setLocale, 
      setForm,
      resetForm, 
      saveToProfile, 
      saveConfiguration,
      fetchProfile,
      changePassword,
      setChangePassword,
      resetChangePassword,
      setError,
      dismissError,
      setConfirm,
      resetConfirm,
      setHistoryDataUnsynced,
      goTo: route => push(route),
      updateDevice,
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
      //profile
      updateProfileForm: data => dispatchProps.setForm('profileForm', data),
      //members
      updateMemberForm: data => dispatchProps.setForm('memberForm', data),
      clearMemberForm: () => dispatchProps.resetForm('memberForm'),
      confirmAddMember: () => dispatchProps.setConfirm('create', stateProps.memberForm),
      confirmEditMember: () => dispatchProps.setConfirm('update', stateProps.memberForm),
      confirmDeleteMember: () => dispatchProps.setConfirm('delete', stateProps.memberForm),
      //devices
      updateDeviceForm: data => dispatchProps.setForm('deviceForm', data),
      //commons    
      updateCommonForm: common => dispatchProps.setForm('commonForm', common), 
      clearCommonForm: () => dispatchProps.resetForm('commonForm'), 
      searchCommons: () => { 
        dispatchProps.searchCommons({ name: stateProps.searchFilter }); 
        dispatchProps.resetForm('commonForm');
      },
      confirmCreateCommon: () => dispatchProps.setConfirm('create', stateProps.commonForm),
      confirmUpdateCommon: () => dispatchProps.setConfirm('update', stateProps.commonForm),
      confirmDeleteCommon: () => dispatchProps.setConfirm('delete', stateProps.commonForm),
      confirmJoinCommon: () => dispatchProps.setConfirm('join', stateProps.commonForm),
      confirmLeaveCommon: () => dispatchProps.setConfirm('leave', stateProps.commonForm),
      saveFavoriteCommon: (key) => { 
        dispatchProps.setFavorite(key);
        dispatchProps.saveConfiguration({ favoriteCommon: key });
        dispatchProps.setHistoryDataUnsynced();
      },
    },
    ...ownProps,
    members: getAllMembers(stateProps.members),
    pagingIndex: stateProps.pagingIndex + 1, // 1-based
    _t: formatMessage(ownProps.intl),
  };
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                        mergeProps
                                       )(Settings));
module.exports = SettingsData;
