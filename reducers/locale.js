const types = require('../constants/ActionTypes');

const initialState = {
  messages: null,
  locale: null,
};

const locales = function (state = initialState, action) {
  switch (action.type) {
    case types.LOCALE_RECEIVED_MESSAGES:
      return Object.assign({}, state, {
        messages: action.messages,
        locale: action.locale,
      });
    
    default:
      return state;
  }
};

module.exports = locales;

