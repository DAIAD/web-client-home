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
const CommonsActions = require('./CommonsActions');
const CommonsManageActions = require('./CommonsManageActions');
const FormActions = require('./FormActions');
const { letTheRightOneIn } = require('./UserActions');
const NotificationActions = require('./NotificationActions');

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

const linkToSection = function (section, options) {
  return function (dispatch, getState) {
    switch (section) {
      case 'history':
        return dispatch(HistoryActions.linkToHistory(options));
      case 'notifications': 
        return dispatch(NotificationActions.linkToNotification(options));
      case 'commons':
        return dispatch(CommonsActions.linkToCommons(options));
      default:
        return Promise.resolve();
    }
  };
};


/**
 * Call all necessary actions to initialize app with profile data 
 *
 * @param {Object} profile - profile object as returned from server
 */
const initHome = function (profile) {
  return function (dispatch, getState) { 
    if (profile.configuration) {
      const configuration = JSON.parse(profile.configuration);
      if (configuration.widgets) {
        dispatch(DashboardActions.setWidgets(configuration.widgets));
      }
      if (configuration.layout) {
        dispatch(DashboardActions.updateLayout(configuration.layout, false));
      }
      if (configuration.favoriteCommon) {
        dispatch(CommonsManageActions.setFavorite(configuration.favoriteCommon));
        dispatch(CommonsActions.setActive(configuration.favoriteCommon));
      }
    }

    if (getMeterCount(profile.devices) === 0) {
      dispatch(HistoryActions.switchActiveDeviceType('AMPHIRO'));
      dispatch(DashboardActions.setDeviceType('AMPHIRO'));
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

    if (profile.locale) {
      dispatch(LocaleActions.setLocale(profile.locale));
    }

    // need to perform following actions sequentially 
    return [
      HistoryActions.initPriceBrackets(),
      HistoryActions.initWaterBreakdown(),
      CommonsActions.getMyCommons(),
      NotificationActions.fetchInitial(),
      DashboardActions.fetchAllWidgetsData(),
    ]
    .reduce((prev, curr) => prev.then(() => dispatch(curr)), Promise.resolve());
  };
};

module.exports = {
  initHome,
  setReady,
  linkToSection,
};
