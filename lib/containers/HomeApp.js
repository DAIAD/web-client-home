'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-router-redux'),
    push = _require3.push;

var HomeRoot = require('../components/sections/HomeRoot');

var _require4 = require('../actions/UserActions'),
    login = _require4.login,
    logout = _require4.logout,
    refreshProfile = _require4.refreshProfile,
    requestPasswordReset = _require4.requestPasswordReset;

var _require5 = require('../actions/InitActions'),
    setReady = _require5.setReady;

var _require6 = require('../actions/LocaleActions'),
    setLocale = _require6.setLocale;

var _require7 = require('../actions/NotificationActions'),
    linkToNotification = _require7.linkToNotification,
    fetchMoreAll = _require7.fetchMoreAll;

var _require8 = require('../actions/QueryActions'),
    dismissError = _require8.dismissError;

var _require9 = require('../actions/ViewportActions'),
    resize = _require9.resize;

var _require10 = require('../utils/messages'),
    combineMessages = _require10.combineMessages;

function mapStateToProps(state) {
  return {
    user: state.user,
    ready: state.user.ready,
    locale: state.locale,
    errors: state.query.errors,
    success: state.query.success > 0,
    loading: state.query.isLoading > 0,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
    totalNotifications: state.section.messages.total
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: logout,
    setLocale: setLocale,
    linkToNotification: linkToNotification,
    refreshProfile: refreshProfile,
    dismissError: dismissError,
    setReady: setReady,
    resize: resize,
    fetchMoreAll: fetchMoreAll,
    goTo: push
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var messageArray = combineMessages([{ name: 'alerts', values: stateProps.alerts }, { name: 'announcements', values: stateProps.announcements }, { name: 'recommendations', values: stateProps.recommendations }, { name: 'tips', values: stateProps.tips }]);

  return _extends({}, stateProps, dispatchProps, ownProps, {
    init: function init() {
      dispatchProps.setLocale(properties.locale);
      if (properties.reload) {
        dispatchProps.refreshProfile();
      } else {
        dispatchProps.setReady();
      }
    },
    unreadNotifications: messageArray.reduce(function (prev, curr) {
      return !curr.acknowledgedOn ? prev + 1 : prev;
    }, 0),
    messages: messageArray,
    totalNotifications: Object.values(stateProps.totalNotifications).reduce(function (p, c) {
      return p + c;
    }, 0)
  });
}

var HomeApp = connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeRoot);
module.exports = HomeApp;