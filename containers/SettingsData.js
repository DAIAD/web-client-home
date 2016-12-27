const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const { setLocale } = require('../actions/LocaleActions');
const { saveToProfile, fetchProfile } = require('../actions/UserActions');
const { setForm } = require('../actions/FormActions');

const Settings = require('../components/sections/Settings');

function mapStateToProps(state) {
  return {
    profile: state.forms.profileForm,
    locale: state.locale.locale,
    devices: state.user.profile.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    setLocale, 
    setForm, 
    saveToProfile, 
    fetchProfile,
  }, dispatch);
}

const SettingsData = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps,
                                       )(Settings));
module.exports = SettingsData;
