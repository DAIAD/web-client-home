const types = require('../constants/ActionTypes');

const initialState = {
  password: null,
  ready: false,
};

const login = function (state = initialState, action) { 
  switch (action.type) {
    case types.HOME_IS_READY:
      return Object.assign({}, state, {
        ready: true,
      });

    case types.HOME_FORGOT_PASSWORD:
      return Object.assign({}, state, {
        password: action.mode,
      });

    default:
      return state;
  }
};

module.exports = login;

