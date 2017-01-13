const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const HomeRoot = require('../components/sections/HomeRoot');

const { login, logout, refreshProfile, letTheRightOneIn } = require('../actions/UserActions');
const { setReady } = require('../actions/InitActions');
const { setLocale } = require('../actions/LocaleActions');
const { linkToMessage: linkToNotification } = require('../actions/MessageActions');
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
    loading: state.user.status.isLoading 
      || state.locale.status.isLoading 
      || state.query.isLoading,
    messages: state.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    login, 
    logout, 
    refreshProfile, 
    letTheRightOneIn, 
    setLocale, 
    linkToNotification, 
    dismissError, 
    setReady, 
    resize,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const messageArray = combineMessages([
      { name: 'alerts', values: stateProps.messages.alerts },
      { name: 'announcements', values: stateProps.messages.announcements },
      { name: 'recommendations', values: stateProps.messages.recommendations },
      { name: 'tips', values: stateProps.messages.tips },
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
          dispatchProps.refreshProfile()
          .then((res) => {
            if (res.success) {
              dispatchProps.setReady();
              dispatchProps.letTheRightOneIn();
            }
          });
        } else {
          dispatchProps.setReady();
        }
      });
    },
    login: (user, pass) => dispatchProps.login(user, pass)
      .then(res => (res.success ? dispatchProps.letTheRightOneIn() : null)),
    unreadNotifications: messageArray
      .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
    messages: messageArray,
  };
}


const HomeApp = connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeRoot);
module.exports = HomeApp;
