const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const CommonsActions = require('../actions/CommonsActions');
const { setLocale } = require('../actions/LocaleActions');
const { saveToProfile, fetchProfile } = require('../actions/UserActions');
const { setForm, resetForm } = require('../actions/FormActions');
const { setError, dismissError } = require('../actions/QueryActions');

const Settings = require('../components/sections/settings/');

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return {
    profile: state.forms.profileForm,
    errors: state.query.errors,
    locale: state.locale.locale,
    devices: state.user.profile.devices,
    myCommons: state.section.commons.myCommons,
    allCommons: state.section.commons.allCommons,
    searchFilter: state.section.commons.searchFilter,
    confirmation: state.section.commons.confirm,
    commonForm: state.forms.commonForm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ 
      ...CommonsActions,
      setLocale, 
      setForm,
      resetForm, 
      saveToProfile, 
      fetchProfile,
      setError,
      dismissError,
      goTo: route => push(route),
    }, dispatch),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    allCommonsFiltered: stateProps.allCommons
      .filter(common => !common.joined)
      .filter(common => stateProps.searchFilter === '' ? true : matches(common.name, stateProps.searchFilter)),
  };
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                        mergeProps
                                       )(Settings));
module.exports = SettingsData;
