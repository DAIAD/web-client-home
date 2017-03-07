const types = require('../constants/ActionTypes');

const initialState = {
  isAuthenticated: false,
  csrf: null,
  ready: false,
  profile: {
    devices: [],
    household: {
      members: [],
    },
  }
};

const user = function (state = initialState, action) { 
  switch (action.type) {
      
    case types.USER_RECEIVED_LOGIN:
      return Object.assign({}, state, {
        profile: action.profile,
      });

    case types.USER_LET_IN:
      return Object.assign({}, state, {
        isAuthenticated: true
      });
    
    case types.HOME_IS_READY:
      return Object.assign({}, state, {
        ready: true,
      });


    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, state, {
        isAuthenticated: false,
        profile: {},
        csrf: null,
      });

    case types.USER_SESSION_SET_CSRF:
      return Object.assign({}, state, {
        csrf: action.csrf 
      });

    default:
      return state;
  }
};

module.exports = user;

