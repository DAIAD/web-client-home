'use strict';

var types = require('../constants/ActionTypes');

var ViewportActions = {
  resize: function resize(width, height) {
    return {
      type: types.VIEWPORT_SET_SIZE,
      width: width,
      height: height
    };
  }
};

module.exports = ViewportActions;