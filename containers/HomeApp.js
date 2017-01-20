const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const HomeRoot = require('../components/sections/HomeRoot');

const { login, logout, refreshProfile, requestPasswordReset } = require('../actions/UserActions');
const { setReady, setForgotPassword } = require('../actions/InitActions');
const { setLocale } = require('../actions/LocaleActions');
const { linkToMessage: linkToNotification } = require('../actions/MessageActions');
const { dismissError } = require('../actions/QueryActions');
const { resize } = require('../actions/ViewportActions');
const { combineMessages } = require('../utils/messages');

function mapStateToProps(state) {
  return {
    user: state.user,
    ready: state.section.login.ready,
    locale: state.locale,
    errors: state.query.errors,
    success: state.query.success,
    loading: state.locale.status.isLoading 
      || state.query.isLoading,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
    forgotPassword: state.section.login.password,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    login, 
    logout, 
    refreshProfile, 
    setLocale, 
    linkToNotification, 
    dismissError, 
    setReady, 
    resize,
    setForgotPassword,
    requestPasswordReset,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const messageArray = combineMessages([
      { name: 'alerts', values: stateProps.alerts },
      { name: 'announcements', values: stateProps.announcements },
      { name: 'recommendations', values: stateProps.recommendations },
      { name: 'tips', values: stateProps.tips },
  ]);

  return { 
    ...stateProps,
    ...dispatchProps,
    ...ownProps, 
    init: () => {
      // init locale
      dispatchProps.setLocale(properties.locale)
      .then(() => {
        // refresh profile if session exists
        if (properties.reload) {
          dispatchProps.refreshProfile(); 
        } else {
          dispatchProps.setReady();
        }
      });
    },
    unreadNotifications: messageArray
      .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
    messages: messageArray,
  };
}


const HomeApp = connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeRoot);
module.exports = HomeApp;
