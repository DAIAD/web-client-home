'use strict';

var _require = require('react-router'),
    useRouterHistory = _require.useRouterHistory;

var _require2 = require('history'),
    createHistory = _require2.createHistory;

var history = useRouterHistory(createHistory)({
  basename: '/home/'
});

module.exports = history;