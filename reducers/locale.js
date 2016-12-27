const types = require('../constants/ActionTypes');

const initialState = {
  status: {
    success: false,
    errors: null,
    isLoading: false,
  },
  messages: null,
  locale: null,
};

const locales = function (state = initialState, action) {
  switch (action.type) {
    case types.LOCALE_REQUEST_MESSAGES:
      return Object.assign({}, state, {
        status: {
          isLoading: true,
        }
      });

    case types.LOCALE_RECEIVED_MESSAGES:
      switch (action.success) {
        case true:
          return Object.assign({}, state, {
            status: {
              success: true,
              errors: null,
              isLoading: false,
            },
            messages: action.messages,
            locale: action.locale
          });

        case false:
          return Object.assign({}, state, {
            status: {
              success: false,
              errors: action.errors,
              isLoading: false,
            },
          });
        
        default:
          return state;
      }

    default:
      return state;
  }
};

module.exports = locales;

