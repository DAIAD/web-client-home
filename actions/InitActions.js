/**
 * User Actions module.
 * User related action creators
 * 
 * @module UserActions
 */

const types = require('../constants/ActionTypes');
const LocaleActions = require('./LocaleActions');
const DashboardActions = require('./DashboardActions');
const HistoryActions = require('./HistoryActions');
const FormActions = require('./FormActions');
const { letTheRightOneIn } = require('./UserActions');
const { fetchAll: fetchAllMessages } = require('./MessageActions');
const { getMeterCount } = require('../utils/device');
const { filterObj } = require('../utils/general');

/**
 * Action dispatched when application has been initialized 
 * (used for loading locale messages & reload if active session
 *
 */

const setReady = function () {
  return {
    type: types.HOME_IS_READY,
  };
};


/**
 * Call all necessary actions to initialize app with profile data 
 *
 * @param {Object} profile - profile object as returned from server
 */
const initHome = function (profile) {
  return function (dispatch, getState) {
    dispatch(fetchAllMessages());

    if (profile.configuration) {
      const configuration = JSON.parse(profile.configuration);
      if (configuration.widgets) {
        dispatch(DashboardActions.setWidgets(configuration.widgets));
      }
      if (configuration.layout) {
        dispatch(DashboardActions.updateLayout(configuration.layout, false));
      }
    }

    if (getMeterCount(profile.devices) === 0) {
      dispatch(HistoryActions.setActiveDeviceType('AMPHIRO', true));
      
      dispatch(FormActions.setForm('widgetToAdd', {
        deviceType: 'AMPHIRO',
        type: 'totalVolumeStat',
        title: 'Shower volume',
      }));
    } else {
      dispatch(HistoryActions.setActiveDeviceType('METER', true));
    }

    const profileForm = filterObj(profile, [
      'firstname', 
      'lastname', 
      'photo',
      'email', 
      'username', 
      'locale', 
      'address', 
      'zip', 
      'country', 
      'timezone', 
      'unit',
    ]);
    
    dispatch(FormActions.setForm('profileForm', profileForm));
    return dispatch(DashboardActions.fetchAllWidgetsData())
    .then(() => {
      dispatch(LocaleActions.setLocale(profile.locale));
      return Promise.resolve({ success: true, profile });
    });
  };
};

module.exports = {
  initHome,
  setReady,
};
