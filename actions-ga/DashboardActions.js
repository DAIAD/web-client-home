const ReactGA = require('react-ga');

const Actions = require('../actions/DashboardActions');

const switchMode = function (mode) {
  if (mode === 'add') {
    ReactGA.modalview('dashboard/add-widget');
  }
  return Actions.switchMode(mode); 
};

const updateLayout = function (layout, dirty) {
  ReactGA.event({
    category: 'dashboard',
    action: 'update layout'
  });
  return Actions.updateLayout(layout, dirty);
};

const updateWidget = function (id, update) {
  ReactGA.event({
    category: 'dashboard',
    action: 'update widget',
  });
  return Actions.updateWidget(id, update);
};

const addWidget = function (options) {
  ReactGA.event({
    category: 'dashboard',
    action: 'add widget',
    label: options.widgetId,
  });
  return Actions.addWidget(options);
};
    
const removeWidget = function (id) {
  ReactGA.event({
    category: 'dashboard',
    action: 'remove widget',
  });
  return Actions.removeWidget(id);
};


module.exports = {
  ...Actions,
  switchMode,
  updateLayout,
  addWidget,
  updateWidget,
  removeWidget,
};

