const types = require('../constants/ActionTypes');

const initialState = {
  showChangePassword: false,
};
 
const profile = function (state = initialState, action) {
  switch (action.type) {
    case types.SETTINGS_SET_CHANGE_PASSWORD:
      return {
        ...state,
        showChangePassword: action.enable,
      };

    default:
      return state;
  }
};

module.exports = profile;

