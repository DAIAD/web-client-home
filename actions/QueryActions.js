const connectActionsToQueryBackend = require('./query/QueryActionsConnector');
const ApiActions = require('./query/ApiActions');
const connectCacheToQueryBackend = require('./query/CacheActionsConnector');

module.exports = connectActionsToQueryBackend(connectCacheToQueryBackend(ApiActions)); 
