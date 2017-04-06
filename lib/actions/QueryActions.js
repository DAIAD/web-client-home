'use strict';

var connectActionsToQueryBackend = require('./query/QueryActionsConnector');
var CacheActions = require('./query/CacheActions');

module.exports = connectActionsToQueryBackend(CacheActions);