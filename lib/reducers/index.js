'use strict';

var _require = require('redux'),
    combineReducers = _require.combineReducers;

var _require2 = require('react-router-redux'),
    routerReducer = _require2.routerReducer;

var locale = require('./locale');
var user = require('./user');
var query = require('./query');
var history = require('./history');
var dashboard = require('./dashboard');
var reports = require('./reports');
var messages = require('./messages');
var forms = require('./forms');
var viewport = require('./viewport');
var commons = require('./commons');
var manageCommons = require('./manageCommons');
var profile = require('./profile');

var rootReducer = combineReducers({
  routing: routerReducer,
  locale: locale,
  user: user,
  query: query,
  forms: forms,
  viewport: viewport,
  section: combineReducers({
    history: history,
    dashboard: dashboard,
    messages: messages,
    reports: reports,
    commons: commons,
    settings: combineReducers({
      commons: manageCommons,
      profile: profile
    })

  })
});

module.exports = rootReducer;