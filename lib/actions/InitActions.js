'use strict';

/**
 * User Actions module.
 * User related action creators
 * 
 * @module UserActions
 */

var types = require('../constants/ActionTypes');
var LocaleActions = require('./LocaleActions');
var DashboardActions = require('./DashboardActions');
var HistoryActions = require('./HistoryActions');
var CommonsActions = require('./CommonsActions');
var CommonsManageActions = require('./CommonsManageActions');
var FormActions = require('./FormActions');

var _require = require('./UserActions'),
    letTheRightOneIn = _require.letTheRightOneIn;

var NotificationActions = require('./NotificationActions');

var _require2 = require('../utils/device'),
    getMeterCount = _require2.getMeterCount;

var _require3 = require('../utils/general'),
    filterObj = _require3.filterObj;

/**
 * Action dispatched when application has been initialized 
 * (used for loading locale messages & reload if active session
 *
 */

var setReady = function setReady() {
  return {
    type: types.HOME_IS_READY
  };
};

var linkToSection = function linkToSection(section, options) {
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
var initHome = function initHome(profile) {
  return function (dispatch, getState) {
    if (profile.configuration) {
      var configuration = JSON.parse(profile.configuration);
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

    var profileForm = filterObj(profile, ['firstname', 'lastname', 'photo', 'email', 'username', 'locale', 'address', 'zip', 'country', 'timezone', 'unit']);

    dispatch(FormActions.setForm('profileForm', profileForm));

    if (profile.locale) {
      dispatch(LocaleActions.setLocale(profile.locale));
    }

    // need to perform following actions sequentially 
    return [HistoryActions.initPriceBrackets(), HistoryActions.initWaterBreakdown(), CommonsActions.getMyCommons(), NotificationActions.fetchInitial(), DashboardActions.fetchAllWidgetsData()].reduce(function (prev, curr) {
      return prev.then(function () {
        return dispatch(curr);
      });
    }, Promise.resolve());
  };
};

module.exports = {
  initHome: initHome,
  setReady: setReady,
  linkToSection: linkToSection
};