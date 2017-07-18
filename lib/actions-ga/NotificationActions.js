'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/NotificationActions');

var _require = require('../utils/messages'),
    getCategoryByType = _require.getCategoryByType;

var setActiveTab = function setActiveTab(category) {
  ReactGA.modalview('notification/' + category);
  return Actions.setActiveTab(category);
};

var tweetMessage = function tweetMessage(id) {
  ReactGA.event({
    category: 'notifications',
    action: 'tweet',
    label: id.toString()
  });
  return Actions.tweetMessage(id);
};

var setActiveMessage = function setActiveMessage(id, type) {
  var category = getCategoryByType(type);
  ReactGA.event({
    category: 'notifications',
    action: 'read',
    label: category + '/' + id
  });
  return Actions.setActiveMessage(id, type);
};

module.exports = _extends({}, Actions, {
  setActiveTab: setActiveTab,
  setActiveMessage: setActiveMessage,
  tweetMessage: tweetMessage
});