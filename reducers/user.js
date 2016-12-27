const types = require('../constants/ActionTypes');

const initialState = {
  status: {
    isLoading: false
  },
  ready: false,
  isAuthenticated: false,
  csrf: null,
  profile: {
    devices: []
  }
};

const user = function (state = initialState, action) { 
  switch (action.type) {
    case types.HOME_IS_READY:
      return Object.assign({}, state, {
        ready: true
      });
  
    case types.USER_REQUESTED_LOGIN:
      return Object.assign({}, state, {
        status: {
          isLoading: true
        }
      });

    case types.USER_RECEIVED_LOGIN:
      switch (action.success) {
        case true:
          return Object.assign({}, state, {
            status: {
              success: true,
              isLoading: false,
              errors: null
            },
            profile: action.profile,
          });
        
        case false:
          return Object.assign({}, state, {
            status: {
              success: false,
              isLoading: false,
              errors: action.errors
            }
          });
        
        default: 
          return state;
      }

    case types.USER_LET_IN:
      return Object.assign({}, state, {
        isAuthenticated: true
      });

    case types.USER_REQUESTED_LOGOUT:
      return Object.assign({}, state, {
        status: {
          isLoading: true,
        }
      });

    case types.USER_RECEIVED_LOGOUT:
      switch (action.success) {
        case true:
          return Object.assign({}, state, {
            status: {
              success: true,
              isLoading: false,
              errors: null
            },
            isAuthenticated: false,
            profile: {},
            csrf: null,
          });
        
        case false:
          return Object.assign({}, state, {
            status: {
              success: false,
              isLoading: false,
              errors: action.errors
            }
          });
        
        default: 
          return state;
      }

    case types.USER_SESSION_SET_CSRF:
      return Object.assign({}, state, {
        csrf: action.csrf 
      });

    default:
      return state;
  }
};

module.exports = user;

