const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const { setDataUnsynced: setHistoryDataUnsynced } = require('../actions-ga/HistoryActions');
const { setWidgetTypeUnsynced } = require('../actions-ga/DashboardActions');
const CommonsManageActions = require('../actions-ga/CommonsManageActions');
const MembersManageActions = require('../actions-ga/MembersManageActions');
const { setLocale } = require('../actions-ga/LocaleActions');
const { saveToProfile, saveConfiguration, fetchProfile, changePassword, updateDevice, addMember, editMember, removeMember } = require('../actions-ga/UserActions');
const { setChangePassword, resetChangePassword } = require('../actions-ga/ProfileActions'); 
const { setForm, resetForm, setConfirm, resetConfirm } = require('../actions-ga/FormActions');
const { setError, dismissError } = require('../actions-ga/QueryActions');

const Settings = require('../components/sections/settings/');

const { getAllMembers, formatMessage } = require('../utils/general');

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return {
    errors: state.query.errors,
    locale: state.locale.locale,
    profile: state.user.profile,
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
      setWidgetTypeUnsynced,
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
      //profile
      updateProfileForm: data => dispatchProps.setForm('profileForm', data),
      resetChangePassword: () => {
        dispatchProps.resetChangePassword();
        dispatchProps.setForm('profileForm', { password: null, confirmPassword: null });
      },
      saveToProfile: () => dispatchProps.saveToProfile(stateProps.profileForm)
      .then((profile) => {
        if (stateProps.profileForm.firstname) {
          dispatchProps.setWidgetTypeUnsynced('ranking');
          return dispatchProps.editMember({ index: 0, name: stateProps.profileForm.firstname });
        }
        return Promise.resolve(profile);
      })
      .then(() => dispatchProps.fetchProfile()),
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
        dispatchProps.setWidgetTypeUnsynced('commons');
      },
    },
    ...ownProps,
    devices: stateProps.profile.devices,
    members: getAllMembers(stateProps.profile.household.members, stateProps.profile.photo),
    pagingIndex: stateProps.pagingIndex + 1, // 1-based
    _t: formatMessage(ownProps.intl),
  };
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                        mergeProps
                                       )(Settings));
module.exports = SettingsData;
