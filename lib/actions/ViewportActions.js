'use strict';

var types = require('../constants/ActionTypes');

var ViewportActions = {
  resize: function resize(width, height) {
    return {
      type: types.VIEWPORT_SET_SIZE,
      width: width,
      height: height,
      meta: {
        debounce: {
          time: 200
        }
      }
    };
  }
};

module.exports = ViewportActions;