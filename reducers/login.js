const types = require('../constants/ActionTypes');

const initialState = {
  ready: false,
};

const login = function (state = initialState, action) { 
  switch (action.type) {
    case types.HOME_IS_READY:
      return Object.assign({}, state, {
        ready: true,
      });

    default:
      return state;
  }
};

module.exports = login;

