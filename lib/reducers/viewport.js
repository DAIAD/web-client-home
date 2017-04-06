'use strict';

var types = require('../constants/ActionTypes');

var initialState = {
  width: document && document.documentElement ? document.documentElement.clientWidth : null,
  height: document && document.documentElement ? document.documentElement.clientHeight : null
};

var viewport = function viewport() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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