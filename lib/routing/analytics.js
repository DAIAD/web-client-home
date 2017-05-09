'use strict';

var ReactGA = require('react-ga');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

module.exports = logPageView;