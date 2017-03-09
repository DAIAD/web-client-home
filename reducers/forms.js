const types = require('../constants/ActionTypes');

const initialState = {
  widgetToAdd: {},
  profileForm: {},
  commonForm: {},
  memberForm: {},
  deviceForm: {
    unit: 'METRIC',
    key: null,
    registeredOn: null,
    name: '',
    properties: [],
  },
  confirm: {
    mode: null,
    item: null,
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
      newState[action.form] = { ...initialState[action.form] };

      return newState;
    }

    case types.USER_RECEIVED_LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};

module.exports = form;
