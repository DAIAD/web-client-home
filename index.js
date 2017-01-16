// Dependencies
const React = require('react');
const ReactDOM = require('react-dom');
const ReduxProvider = require('react-redux').Provider;
const Router = require('react-router').Router;
const { syncHistoryWithStore } = require('react-router-redux');
const ReactIntl = require('react-intl');
require('babel-polyfill');

const store = require('./store/');
const routes = require('./routing/routes');
const routerHistory = require('./routing/history');

const history = syncHistoryWithStore(routerHistory, store);

ReactIntl.addLocaleData(require('react-intl/locale-data/en'));
ReactIntl.addLocaleData(require('react-intl/locale-data/el'));
ReactIntl.addLocaleData(require('react-intl/locale-data/es'));
ReactIntl.addLocaleData(require('react-intl/locale-data/de'));

ReactDOM.render(
  <ReduxProvider store={store}>
    <Router
      history={history}
      routes={routes()}
    />
  </ReduxProvider>,
  document.getElementById('app')
);
