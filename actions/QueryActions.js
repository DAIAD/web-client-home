const connectActionsToQueryBackend = require('./query/QueryActionsConnector');
const ApiActions = require('./query/ApiActions');
const connectCacheToQueryBackend = require('./query/CacheActionsConnector');
const ReactGA = require('react-ga');

const actions = connectActionsToQueryBackend(connectCacheToQueryBackend(ApiActions));

module.exports = {
  ...actions,
  setError: (error) => {
    //intercept application errors
    ReactGA.event({
      category: 'error',
      action: `${error && error.message}`
    });
    return actions.setError(error);
  },
};
