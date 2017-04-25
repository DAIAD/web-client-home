const types = require('../constants/ActionTypes');

const { updateOrAppendToSession } = require('../utils/sessions');
const { getYear } = require('../utils/time');

const initialState = {
  timeFilter: 'year',
  time: getYear(),
  reports: [],
};
 
const reports = function (state = initialState, action) {
  switch (action.type) {
    case types.REPORTS_SET_TIME:
      return {
        ...state,
        time: {
          ...state.time,
          ...action.time,
        },
      };
    
    case types.REPORTS_SET_TIME_FILTER:
      return {
        ...state,
        timeFilter: action.filter,
      };
    
    case types.REPORTS_SET: 
      return {
        ...state,
        reports: action.reports,
      };

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = reports;

