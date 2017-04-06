const connectActionsToQueryBackend = require('./query/QueryActionsConnector');
const CacheActions = require('./query/CacheActions');

module.exports = connectActionsToQueryBackend(CacheActions);
