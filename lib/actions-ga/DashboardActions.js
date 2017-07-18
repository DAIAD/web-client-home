'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/DashboardActions');

var switchMode = function switchMode(mode) {
  if (mode === 'add') {
    ReactGA.modalview('dashboard/add-widget');
  }
  return Actions.switchMode(mode);
};

var updateLayout = function updateLayout(layout, dirty) {
  ReactGA.event({
    category: 'dashboard',
    action: 'update layout'
  });
  return Actions.updateLayout(layout, dirty);
};

var updateWidget = function updateWidget(id, update) {
  ReactGA.event({
    category: 'dashboard',
    action: 'update widget'
  });
  return Actions.updateWidget(id, update);
};

var addWidget = function addWidget(options) {
  ReactGA.event({
    category: 'dashboard',
    action: 'add widget',
    label: options.widgetId
  });
  return Actions.addWidget(options);
};

var removeWidget = function removeWidget(id) {
  ReactGA.event({
    category: 'dashboard',
    action: 'remove widget'
  });
  return Actions.removeWidget(id);
};

module.exports = _extends({}, Actions, {
  switchMode: switchMode,
  updateLayout: updateLayout,
  addWidget: addWidget,
  updateWidget: updateWidget,
  removeWidget: removeWidget
});