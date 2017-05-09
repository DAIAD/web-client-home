'use strict';

// Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var ReduxProvider = require('react-redux').Provider;
var Router = require('react-router').Router;

var _require = require('react-router-redux'),
    syncHistoryWithStore = _require.syncHistoryWithStore;

var ReactIntl = require('react-intl');
var ReactGA = require('react-ga');
require('babel-polyfill');

var store = require('./store/');
var routes = require('./routing/routes');
var routerHistory = require('./routing/history');
var logPageView = require('./routing/analytics');

var history = syncHistoryWithStore(routerHistory, store);

ReactIntl.addLocaleData(require('react-intl/locale-data/en'));
ReactIntl.addLocaleData(require('react-intl/locale-data/el'));
ReactIntl.addLocaleData(require('react-intl/locale-data/es'));
ReactIntl.addLocaleData(require('react-intl/locale-data/de'));

ReactGA.initialize(properties.gaCode);

ReactDOM.render(React.createElement(
  ReduxProvider,
  { store: store },
  React.createElement(Router, {
    history: history,
    routes: routes(),
    onUpdate: logPageView
  })
), document.getElementById('app'));