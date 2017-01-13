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
      if (configuration.infoboxes) {
        dispatch(DashboardActions.setInfoboxes(configuration.infoboxes));
      }
      if (configuration.layout) {
        dispatch(DashboardActions.updateLayout(configuration.layout, false));
      }
    }

    if (getMeterCount(getState().user.profile.devices) === 0) {
      dispatch(HistoryActions.setActiveDeviceType('AMPHIRO', true));
      
      dispatch(FormActions.setForm('infoboxToAdd', {
        deviceType: 'AMPHIRO',
        type: 'totalVolumeStat',
        title: 'Shower volume',
      }));
    } else {
      dispatch(HistoryActions.setActiveDeviceType('METER', true));
    }
 
    const { 
      firstname, 
      lastname, 
      photo,
      email, 
      username, 
      locale, 
      address, 
      zip, 
      country, 
      timezone, 
    } = profile;

    const profileData = { 
      firstname, 
      lastname, 
      photo,
      email, 
      username, 
      locale,
      address, 
      zip, 
      country, 
      timezone, 
    };
    
    dispatch(FormActions.setForm('profileForm', profileData));
    
    return dispatch(DashboardActions.fetchAllInfoboxesData())
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
