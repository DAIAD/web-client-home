'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var initialState = {
  isLoading: 0,
  success: null,
  errors: null,
  info: null,
  cache: {}
};

var query = function query() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.QUERY_REQUEST_START:
      return Object.assign({}, state, {
        isLoading: state.isLoading + 1
      });

    case types.QUERY_REQUEST_END:
      switch (action.success) {
        case true:
          return Object.assign({}, state, {
            isLoading: state.isLoading - 1,
            success: true
          });

        case false:
          return Object.assign({}, state, {
            isLoading: state.isLoading - 1,
            success: false,
            errors: action.errors
          });

        default:
          return state;
      }

    case types.QUERY_RESET_SUCCESS:
      return Object.assign({}, state, {
        success: null
      });

    case types.QUERY_SET_ERROR:
      return Object.assign({}, state, {
        errors: action.error
      });

    case types.QUERY_DISMISS_ERROR:
      return Object.assign({}, state, {
        errors: null
      });

    case types.QUERY_SET_CACHE:
      {
        return Object.assign({}, state, {
          cache: action.cache
        });
      }

    case types.QUERY_SAVE_TO_CACHE:
      {
        var newCache = _extends({}, state.cache);
        newCache[action.key] = {
          data: action.data,
          counter: 1
        };
        return Object.assign({}, state, {
          cache: newCache
        });
      }

    case types.QUERY_CACHE_ITEM_REQUESTED:
      {
        var _newCache = _extends({}, state.cache);
        _newCache[action.key] = _extends({}, _newCache[action.key], {
          counter: _newCache[action.key].counter + 1
        });
        return Object.assign({}, state, {
          cache: _newCache
        });
      }

    case types.QUERY_SET_INFO:
      return Object.assign({}, state, {
        info: action.info
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