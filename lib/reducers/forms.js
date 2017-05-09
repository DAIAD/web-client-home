'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var initialState = {
  widgetToAdd: {},
  profileForm: {},
  commonForm: {
    name: '',
    description: ''
  },
  memberForm: {},
  deviceForm: {
    unit: 'METRIC',
    key: null,
    registeredOn: null,
    name: '',
    properties: []
  },
  shower: {
    time: null
  },
  confirm: {
    mode: null,
    item: null
  }
};

var form = function form() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.FORM_SET:
      {
        var newState = _extends({}, state);
        newState[action.form] = _extends({}, newState[action.form], action.formData);

        return newState;
      }

    case types.FORM_RESET:
      {
        var _newState = _extends({}, state);
        _newState[action.form] = _extends({}, initialState[action.form]);

        return _newState;
      }

    case types.USER_RECEIVED_LOGOUT:
      return _extends({}, initialState);

    default:
      return state;
  }
};

module.exports = form;