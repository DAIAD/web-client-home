const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

//const CommonsActions = require('../actions/CommonsActions');
const CommonsManageActions = require('../actions/CommonsManageActions');
const { setLocale } = require('../actions/LocaleActions');
const { saveToProfile, fetchProfile, updateDevice } = require('../actions/UserActions');
const { setForm, resetForm } = require('../actions/FormActions');
const { setError, dismissError } = require('../actions/QueryActions');

const Settings = require('../components/sections/settings/');

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return {
    errors: state.query.errors,
    locale: state.locale.locale,
    devices: state.user.profile.devices,
    profileForm: state.forms.profileForm,
    deviceForm: state.forms.deviceForm,
    myCommons: state.section.commons.myCommons,
    commonForm: state.forms.commonForm,
    ...state.section.settings.commons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...CommonsManageActions,
      setLocale, 
      setForm,
      resetForm, 
      saveToProfile, 
      fetchProfile,
      setError,
      dismissError,
      goTo: route => push(route),
      updateDevice,
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
      updateProfileForm: data => dispatchProps.setForm('profileForm', data),
      updateDeviceForm: data => dispatchProps.setForm('deviceForm', data),
      updateCommonForm: common => dispatchProps.setForm('commonForm', common), 
      clearCommonForm: () => dispatchProps.resetForm('commonForm'), 
      searchCommons: () => { 
        dispatchProps.searchCommons({ name: stateProps.searchFilter }); 
        dispatchProps.resetForm('commonForm');
      },
      confirmCreate: () => dispatchProps.setConfirm(stateProps.commonForm, 'create'),
      confirmUpdate: () => dispatchProps.setConfirm(stateProps.commonForm, 'update'),
      confirmDelete: () => dispatchProps.setConfirm(stateProps.commonForm, 'delete'),
      confirmJoin: () => dispatchProps.setConfirm(stateProps.commonForm, 'join'),
      confirmLeave: () => dispatchProps.setConfirm(stateProps.commonForm, 'leave'),
    },
    pagingIndex: stateProps.pagingIndex + 1, // 1-based
    ...ownProps,
  };
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                        mergeProps
                                       )(Settings));
module.exports = SettingsData;
