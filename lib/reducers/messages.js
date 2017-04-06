'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('../constants/ActionTypes');

var initialState = {
  activeTab: 'alerts',
  activeMessageId: null,
  alerts: [],
  recommendations: [],
  announcements: [],
  tips: [],
  activeIndex: {
    alerts: 0,
    recommendations: 0,
    announcements: 0,
    tips: 0
  },
  total: {
    alerts: 0,
    recommendations: 0,
    announcements: 0,
    tips: 0
  }
};

var messages = function messages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.MESSAGES_SET:
      return Object.assign({}, state, action.messages);

    case types.MESSAGES_APPEND:
      {
        if (!Array.isArray(action.messages) || action.messages.length === 0) return state;
        var newMessages = [].concat(_toConsumableArray(state[action.category]), _toConsumableArray(action.messages));

        var newState = _extends({}, state);
        newState[action.category] = newMessages;

        return newState;
      }

    case types.MESSAGES_SET_ACTIVE_TAB:
      return Object.assign({}, state, {
        activeTab: action.category
      });

    case types.MESSAGES_SET_ACTIVE:
      return Object.assign({}, state, {
        activeMessageId: action.id
      });

    case types.MESSAGE_SET_READ:
      {
        var _newMessages = state[action.category].map(function (m) {
          return m.id === action.id ? _extends({}, m, { acknowledgedOn: action.timestamp }) : m;
        });

        var _newState = _extends({}, state);
        _newState[action.category] = _newMessages;

        return _newState;
      }

    case types.MESSAGE_SET_EXTRA:
      {
        var _newMessages2 = state[action.category].map(function (m) {
          return m.id === action.id ? _extends({}, m, { extra: action.extra }) : m;
        });

        var _newState2 = _extends({}, state);
        _newState2[action.category] = _newMessages2;

        return _newState2;
      }

    case types.MESSAGES_INCREASE_ACTIVE_INDEX:
      {
        var activeIndex = _extends({}, state.activeIndex);
        activeIndex[action.category] += action.step;
        return Object.assign({}, state, { activeIndex: activeIndex });
      }

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = messages;