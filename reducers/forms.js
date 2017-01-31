const types = require('../constants/ActionTypes');

const initialState = {
  widgetToAdd: {
    deviceType: 'METER',
    type: 'totalDifferenceStat',
    title: 'Total volume Stat',
  },
  profileForm: {},
  commonForm: {
    id: null,
    name: '',
    description: '',
    members: [],
    owners: [],
  },
  deviceForm: {
    unit: 'METRIC',
    key: null,
    registeredOn: null,
    name: '',
    properties: [],
  },

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

