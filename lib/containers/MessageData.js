'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('react-intl'),
    injectIntl = _require.injectIntl;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var _require3 = require('react-redux'),
    connect = _require3.connect;

var Notifications = require('../components/sections/Notifications');

var MessageActions = require('../actions/MessageActions');

var prepareWidget = require('../utils/widgets');

var _require4 = require('../utils/messages'),
    stripTags = _require4.stripTags;

var _require5 = require('../utils/general'),
    formatMessage = _require5.formatMessage;

function mapStateToProps(state) {
  return {
    devices: state.user.profile.devices,
    activeTab: state.section.messages.activeTab,
    activeIndex: state.section.messages.activeIndex,
    activeMessageId: state.section.messages.activeMessageId,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
    total: state.section.messages.total,
    loading: state.query.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MessageActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  // joint alerts & announcements
  var alertments = [].concat(_toConsumableArray(stateProps.alerts), _toConsumableArray(stateProps.announcements));

  var messages = [];
  if (stateProps.activeTab === 'alerts') messages = alertments;else if (stateProps.activeTab === 'recommendations') messages = stateProps.recommendations;else if (stateProps.activeTab === 'tips') messages = stateProps.tips;

  // strip tags
  messages = messages.map(function (message) {
    return stripTags(message);
  });

  var categories = [{
    id: 'alerts',
    title: 'notifications.alerts',
    unread: alertments.reduce(function (prev, curr) {
      return !curr.acknowledgedOn ? prev + 1 : prev;
    }, 0)
  }, {
    id: 'recommendations',
    title: 'notifications.recommendations',
    unread: stateProps.recommendations.reduce(function (prev, curr) {
      return !curr.acknowledgedOn ? prev + 1 : prev;
    }, 0)
  }, {
    id: 'tips',
    title: 'notifications.tips',
    unread: stateProps.tips.reduce(function (prev, curr) {
      return !curr.acknowledgedOn ? prev + 1 : prev;
    }, 0)
  }];

  // const unread = categories.reduce(((prev, curr) => curr.unread+prev), 0); 

  var activeMessage = stateProps.activeMessageId ? messages.find(function (x) {
    return x.id === stateProps.activeMessageId;
  }) : null;

  var activeMessageIndex = messages.findIndex(function (m) {
    return m.id === stateProps.activeMessageId;
  });

  var widget = activeMessage && activeMessage.extra ? prepareWidget(activeMessage.extra, stateProps.devices, ownProps.intl) : {};
  return _extends({}, stateProps, dispatchProps, ownProps, {
    nextMessageId: activeMessageIndex != null && messages[activeMessageIndex + 1] ? messages[activeMessageIndex + 1].id : null,
    previousMessageId: activeMessageIndex != null && messages[activeMessageIndex - 1] ? messages[activeMessageIndex - 1].id : null,
    categories: categories,
    widget: widget,
    messages: messages,
    activeMessage: activeMessage,
    fetchMoreActive: function fetchMoreActive() {
      if (stateProps.activeTab === 'alerts') {
        dispatchProps.fetchMoreSingle('alerts');
        dispatchProps.fetchMoreSingle('announcements');
      } else {
        dispatchProps.fetchMoreSingle(stateProps.activeTab);
      }
    },
    totalInCategory: stateProps.total[stateProps.activeTab],
    _t: formatMessage(ownProps.intl)
  });
}

var MessageData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Notifications));
module.exports = MessageData;