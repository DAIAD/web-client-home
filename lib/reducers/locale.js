'use strict';

var types = require('../constants/ActionTypes');

var initialState = {
  messages: null,
  locale: null
};

var locales = function locales() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.LOCALE_RECEIVED_MESSAGES:
      return Object.assign({}, state, {
        messages: action.messages,
        locale: action.locale
      });

    default:
      return state;
  }
};

module.exports = locales;