const types = require('../constants/ActionTypes');

const initialState = {
  isLoading: 0,
  success: 0,
  errors: null,
  info: null,
  cache: {}
};

const query = function (state = initialState, action) {
  switch (action.type) {
    case types.QUERY_REQUEST_START:
      return Object.assign({}, state, {
        isLoading: state.isLoading + 1,
      });

    case types.QUERY_REQUEST_END:
      switch (action.success) {
        case true:
          return Object.assign({}, state, {
            isLoading: state.isLoading - 1,
          });

        case false:
          return Object.assign({}, state, {
            isLoading: state.isLoading - 1,
            errors: action.errors
          });
        
        default:
          return state;
      }

    case types.QUERY_SET_SUCCESS:
      return Object.assign({}, state, {
        success: state.success + 1,
      });

    case types.QUERY_RESET_SUCCESS: 
      return Object.assign({}, state, {
        success: state.success - 1,
      });
    
    case types.QUERY_SET_ERROR:
      return Object.assign({}, state, {
        errors: action.error,
      });

    case types.QUERY_DISMISS_ERROR:
      return Object.assign({}, state, {
        errors: null
      });
                  
    case types.QUERY_SET_CACHE: {
      return Object.assign({}, state, {
        cache: action.cache
      });
    }

    case types.QUERY_SAVE_TO_CACHE: {
      const newCache = { ...state.cache };
      newCache[action.key] = {
        data: action.data,
        counter: 1,
      };
      return Object.assign({}, state, {
        cache: newCache
      });
    }

    case types.QUERY_CACHE_ITEM_REQUESTED: {
      const newCache = { ...state.cache };
      newCache[action.key] = { 
        ...newCache[action.key], 
        counter: newCache[action.key].counter + 1,
      };
      return Object.assign({}, state, {
        cache: newCache
      });
    }
  
    case types.QUERY_SET_INFO:
      return Object.assign({}, state, {
        info: action.info,
      });

    case types.QUERY_DISMISS_INFO:
      return Object.assign({}, state, {
        info: null
      });

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = query;

