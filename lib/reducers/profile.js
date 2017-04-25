'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var initialState = {
  showChangePassword: false
};

var commons = function commons() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.SETTINGS_SET_CHANGE_PASSWORD:
      return _extends({}, state, {
        showChangePassword: action.enable
      });

    default:
      return state;
  }
};

module.exports = commons;