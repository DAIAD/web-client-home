const types = require('../constants/ActionTypes');

const initialState = {
  activeTab: 'alerts',
  activeMessageId: null,
  alerts: [],
  recommendations: [],
  tips: [],
  announcements: [],
};

const messages = function (state = initialState, action) {
  switch (action.type) {
    case types.MESSAGES_SET:
      return Object.assign({}, state, action.messages);

    case types.MESSAGES_APPEND: {
      const newMessages = state[action.category]
      .slice()
      .concat(action.messages);

      const newState = { ...state };
      newState[action.category] = newMessages;

      return newState;
    }

    case types.MESSAGES_SET_ACTIVE_TAB:
      return Object.assign({}, state, {
        activeTab: action.category,
        activeMessageId: null
      });
    
    case types.MESSAGES_SET_ACTIVE:
      return Object.assign({}, state, {
        activeMessageId: action.id
      });

    case types.MESSAGE_SET_READ: {
      const newMessages = state[action.category]
      .map(m => m.id === action.id ? ({ ...m, acknowledgedOn: action.timestamp }) : m);

      const newState = { ...state };
      newState[action.category] = newMessages;
      
      return newState;
    }
  
    case types.MESSAGE_SET_EXTRA: {
      const newMessages = state[action.category]
      .map(m => m.id === action.id ? ({ ...m, ...action.extra }) : m);

      const newState = { ...state };
      newState[action.category] = newMessages;
      
      return newState;
    }

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = messages;

