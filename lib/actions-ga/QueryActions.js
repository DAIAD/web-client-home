'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/QueryActions');

var setError = function setError(error) {
  ReactGA.event({
    category: 'error',
    action: '' + (error && error.message)
  });
  return Actions.setError(error);
};

module.exports = _extends({}, Actions, {
  setError: setError
});