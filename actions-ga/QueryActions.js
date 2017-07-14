const ReactGA = require('react-ga');

const Actions = require('../actions/QueryActions');

const setError = function (error) {
  ReactGA.event({
    category: 'error',
    action: `${error && error.message}`
  });
  return Actions.setError(error);
};

module.exports = {
  ...Actions,
  setError, 
};
