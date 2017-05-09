'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var connectActionsToQueryBackend = require('./query/QueryActionsConnector');
var ApiActions = require('./query/ApiActions');
var connectCacheToQueryBackend = require('./query/CacheActionsConnector');
var ReactGA = require('react-ga');

var actions = connectActionsToQueryBackend(connectCacheToQueryBackend(ApiActions));

module.exports = _extends({}, actions, {
  setError: function setError(error) {
    //intercept application errors
    ReactGA.event({
      category: 'error',
      action: '' + (error && error.message)
    });
    return actions.setError(error);
  }
});