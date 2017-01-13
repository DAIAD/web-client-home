const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const { setLocale } = require('../actions/LocaleActions');
const { saveToProfile, fetchProfile } = require('../actions/UserActions');
const { setForm, resetForm } = require('../actions/FormActions');
const { setError, dismissError } = require('../actions/QueryActions');

const Settings = require('../components/sections/Settings');

function mapStateToProps(state) {
  return {
    profile: state.forms.profileForm,
    errors: state.query.errors,
    locale: state.locale.locale,
    devices: state.user.profile.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ 
      setLocale, 
      setForm,
      resetForm, 
      saveToProfile, 
      fetchProfile,
      setError,
      dismissError,
    }, dispatch),
  };
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                       )(Settings));
module.exports = SettingsData;
