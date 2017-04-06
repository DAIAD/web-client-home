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

var _require2 = require('./MessageActions'),
    fetchAllMessages = _require2.fetchInitial;

var _require3 = require('../utils/device'),
    getMeterCount = _require3.getMeterCount;

var _require4 = require('../utils/general'),
    filterObj = _require4.filterObj;

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

/**
 * Call all necessary actions to initialize app with profile data 
 *
 * @param {Object} profile - profile object as returned from server
 */
var initHome = function initHome(profile) {
  return function (dispatch, getState) {
    dispatch(fetchAllMessages());
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
      }
    }

    if (getMeterCount(profile.devices) === 0) {
      dispatch(HistoryActions.switchActiveDeviceType('AMPHIRO'));
      dispatch(DashboardActions.setDeviceType('AMPHIRO'));
    }

    var profileForm = filterObj(profile, ['firstname', 'lastname', 'photo', 'email', 'username', 'locale', 'address', 'zip', 'country', 'timezone', 'unit']);

    dispatch(FormActions.setForm('profileForm', profileForm));

    dispatch(HistoryActions.initPriceBrackets());
    dispatch(HistoryActions.initWaterBreakdown());

    var fetchCommonsData = dispatch(CommonsActions.getMyCommons()).then(function (commons) {
      return Array.isArray(commons) && commons.length > 0 ? dispatch(CommonsActions.setActive(commons[0].key)) : null;
    });

    var fetchWidgetsData = dispatch(DashboardActions.fetchAllWidgetsData());

    return Promise.all([fetchCommonsData, fetchWidgetsData]).then(function () {
      dispatch(LocaleActions.setLocale(profile.locale));
      return Promise.resolve({ success: true, profile: profile });
    });
  };
};

module.exports = {
  initHome: initHome,
  setReady: setReady
};