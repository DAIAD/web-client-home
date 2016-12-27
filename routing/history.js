const { useRouterHistory } = require('react-router');
const { createHistory } = require('history');

const history = useRouterHistory(createHistory)({
  basename: '/home/',
});

module.exports = history;
