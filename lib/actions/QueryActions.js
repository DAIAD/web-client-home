'use strict';

var connectActionsToQueryBackend = require('./query/QueryActionsConnector');
var ApiActions = require('./query/ApiActions');
var connectCacheToQueryBackend = require('./query/CacheActionsConnector');

module.exports = connectActionsToQueryBackend(connectCacheToQueryBackend(ApiActions));