const types = require('../constants/ActionTypes');

const initialState = {
  infoboxToAdd: {
    deviceType: 'METER',
    type: 'totalDifferenceStat',
    title: 'Total volume Stat',
  },
  profileForm: {
  }
};

const form = function (state = initialState, action) {
  switch (action.type) {
    case types.FORM_SET: {
      const newState = { ...state };
      newState[action.form] = { ...newState[action.form], ...action.formData };

      return newState;
    }

    case types.FORM_RESET: {
      const newState = { ...state };
      newState[action.form] = { ...newState[action.form], ...initialState[action.form] };

      return newState;
    }

    default:
      return state;
  }
};

module.exports = form;

