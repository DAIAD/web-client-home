'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var _require = require('../utils/sessions'),
    updateOrAppendToSession = _require.updateOrAppendToSession;

var _require2 = require('../utils/time'),
    getYear = _require2.getYear;

var initialState = {
  timeFilter: 'year',
  time: getYear(),
  reports: []
};

var reports = function reports() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.REPORTS_SET_TIME:
      return _extends({}, state, {
        time: _extends({}, state.time, action.time)
      });

    case types.REPORTS_SET_TIME_FILTER:
      return _extends({}, state, {
        timeFilter: action.filter
      });

    case types.REPORTS_SET:
      return _extends({}, state, {
        reports: action.reports
      });

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = reports;