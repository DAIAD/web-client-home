// Dependencies
const React = require('react');
const ReactDOM = require('react-dom');
const ReduxProvider = require('react-redux').Provider;
const Router = require('react-router').Router;
const { syncHistoryWithStore } = require('react-router-redux');
const ReactIntl = require('react-intl');
const ReactGA = require('react-ga');
require('babel-polyfill');

const store = require('./store/');
const routes = require('./routing/routes');
const routerHistory = require('./routing/history');
const logPageView = require('./routing/analytics');

const history = syncHistoryWithStore(routerHistory, store);

ReactIntl.addLocaleData(require('react-intl/locale-data/en'));
ReactIntl.addLocaleData(require('react-intl/locale-data/el'));
ReactIntl.addLocaleData(require('react-intl/locale-data/es'));
ReactIntl.addLocaleData(require('react-intl/locale-data/de'));

ReactGA.initialize(properties.gaCode);

ReactDOM.render(
  <ReduxProvider store={store}>
    <Router
      history={history}
      routes={routes()}
      onUpdate={logPageView}
    />
  </ReduxProvider>,
  document.getElementById('app')
);
