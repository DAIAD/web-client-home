const types = require('../constants/ActionTypes');

const initialState = {
  width: document && document.documentElement ? document.documentElement.clientWidth : null,
  height: document && document.documentElement ? document.documentElement.clientHeight : null
};

const viewport = function (state = initialState, action) {
  switch (action.type) {
    case types.VIEWPORT_SET_SIZE:
      return {
        width: action.width || state.width,
        height: action.height || state.height
      };
    
    default:
      return state;
  }
};

module.exports = viewport;
