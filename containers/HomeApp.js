const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { push } = require('react-router-redux');

const HomeRoot = require('../components/sections/HomeRoot');

const { login, logout, refreshProfile, requestPasswordReset } = require('../actions/UserActions');
const { setReady } = require('../actions/InitActions');
const { setLocale } = require('../actions/LocaleActions');
const { linkToMessage: linkToNotification, fetchMoreAll } = require('../actions/NotificationActions');
const { dismissError } = require('../actions/QueryActions');
const { resize } = require('../actions/ViewportActions');
const { combineMessages } = require('../utils/messages');

function mapStateToProps(state) {
  return {
    user: state.user,
    ready: state.user.ready,
    locale: state.locale,
    errors: state.query.errors,
    success: state.query.success,
    loading: state.query.isLoading > 0,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
    totalNotifications: state.section.messages.total,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    logout, 
    setLocale, 
    linkToNotification, 
    refreshProfile,
    dismissError, 
    setReady,
    resize,
    fetchMoreAll,
    goTo: push,
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
      dispatchProps.setLocale(properties.locale);
      if (properties.reload) {
        dispatchProps.refreshProfile();
      } else {
        dispatchProps.setReady();
      }
    },
    unreadNotifications: messageArray
      .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
    messages: messageArray,
    totalNotifications: Object.values(stateProps.totalNotifications).reduce((p, c) => p + c, 0),
  };
}


const HomeApp = connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeRoot);
module.exports = HomeApp;
