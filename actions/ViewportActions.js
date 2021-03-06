const types = require('../constants/ActionTypes');

const ViewportActions = {
  resize: function (width, height) {
    return {
      type: types.VIEWPORT_SET_SIZE,
      width,
      height,
      meta: {
        debounce: {
          time: 200,
        },
      }, 
    };
  },
};

module.exports = ViewportActions;
