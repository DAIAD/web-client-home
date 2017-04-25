'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * User Actions module.
 * User related action creators
 * 
 * @module UserActions
 */
var _require = require('react-router-redux'),
    push = _require.push;

var userAPI = require('../api/user');
var deviceAPI = require('../api/device');
var types = require('../constants/ActionTypes');

var InitActions = require('./InitActions');

var _require2 = require('./QueryActions'),
    resetSuccess = _require2.resetSuccess,
    requestedQuery = _require2.requestedQuery,
    receivedQuery = _require2.receivedQuery,
    dismissError = _require2.dismissError,
    setInfo = _require2.setInfo;

var _require3 = require('../constants/HomeConstants'),
    SUCCESS_SHOW_TIMEOUT = _require3.SUCCESS_SHOW_TIMEOUT;

var _require4 = require('../utils/general'),
    filterObj = _require4.filterObj,
    throwServerError = _require4.throwServerError;

var receivedLogin = function receivedLogin(profile) {
  return {
    type: types.USER_RECEIVED_LOGIN,
    profile: profile
  };
};

var receivedLogout = function receivedLogout() {
  return {
    type: types.USER_RECEIVED_LOGOUT
  };
};

var setCsrf = function setCsrf(csrf) {
  return {
    type: types.USER_SESSION_SET_CSRF,
    csrf: csrf
  };
};

var setChangePassword = function setChangePassword() {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: true
  };
};

var resetChangePassword = function resetChangePassword() {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: false
  };
};

/**
 * Action that is dispatched after authentication success
 * for optimization purposes 
 *
 * @return {Promise} Resolved or rejected promise with Object 
 * {success:true, profile{Object}} if resolved, {success: false} if rejected
 */
var letTheRightOneIn = function letTheRightOneIn() {
  return {
    type: types.USER_LET_IN
  };
};

/**
 * Fetches profile
 *
 * @return {Promise} Resolved or rejected promise with user profile if resolved, errors if rejected
 */

var fetchProfile = function fetchProfile() {
  return function (dispatch, getState) {
    return userAPI.getProfile().then(function (response) {
      var csrf = response.csrf,
          success = response.success,
          errors = response.errors,
          profile = response.profile;


      if (csrf) {
        dispatch(setCsrf(csrf));
      }

      if (success) {
        dispatch(receivedLogin(profile));
      }
      return Promise.resolve(response);
    });
  };
};

/**
 * Performs user login 
 *
 * @param {String} username
 * @param {String} password
 * @return {Promise} Resolved or rejected promise with user profile if resolved, errors if rejected
 */
var login = function login(username, password) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    return userAPI.login(username, password).then(function (response) {
      var csrf = response.csrf,
          success = response.success,
          errors = response.errors,
          profile = response.profile;


      if (csrf) {
        dispatch(setCsrf(csrf));
      }

      dispatch(receivedQuery(success, errors.length ? errors[0].code : null));

      // Actions that need to be dispatched on login
      if (success) {
        dispatch(dismissError());
        dispatch(receivedLogin(profile));
        return dispatch(InitActions.initHome(profile)).then(function () {
          dispatch(InitActions.setReady());
          dispatch(letTheRightOneIn());

          var transitionState = getState().routing.locationBeforeTransitions.state;
          if (transitionState) {
            // go to saved pathname
            dispatch(push(transitionState.nextPathname));
          } else {
            // go to routing root 
            dispatch(push('/'));
          }
        });
      }
      return Promise.reject(response);
    }).catch(function (errors) {
      console.error('Error caught on user login:', errors);
    });
  };
};

/**
 * Performs user logout 
 *
 * @return {Promise} Resolved or rejected promise, errors if rejected
 */
var logout = function logout() {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    var csrf = getState().user.csrf;

    return userAPI.logout({ csrf: csrf }).then(function (response) {
      var success = response.success,
          errors = response.errors;


      dispatch(push('/login'));
      dispatch(receivedQuery(success, errors.length ? errors[0].code : null));
      dispatch(receivedLogout());

      return response;
    }).catch(function (errors) {
      dispatch(receivedQuery(false, errors));
      //dispatch(receivedLogout());
      console.error('Error caught on logout:', errors);
      return errors;
    });
  };
};

/**
 * Fetches profile and performs necessary initialization when user eefreshes page 
 *
 * @return {Promise} Resolved or rejected promise with user profile if resolved, errors if rejected
 */
var refreshProfile = function refreshProfile() {
  return function (dispatch, getState) {
    dispatch(fetchProfile()).then(function (response) {
      var success = response.success,
          profile = response.profile;


      if (success) {
        // if refresh successful initialize
        dispatch(InitActions.initHome(profile)).then(function () {
          dispatch(InitActions.setReady());
          dispatch(letTheRightOneIn());

          // make sure pathname does not remain /login
          if (getState().routing.locationBeforeTransitions.pathname === 'login') {
            dispatch(push('/'));
          }
        });
      } else {
        // else enable login
        dispatch(InitActions.setReady());
      }
    }).catch(function (errors) {
      console.error('Error caught on profile refresh:', errors);
    });
  };
};

/**
 * Saves JSON data to profile  
 *
 * @param {Object} configuration - serializable object to be saved to user profile
 * @return {Promise} Resolved or rejected promise, with errors if rejected
 */
var saveToProfile = function saveToProfile(profile) {
  return function (dispatch, getState) {
    // TODO: country is there because of bug in backend 
    // that sets it to null otherwise causing problems
    var data = _extends({
      country: 'Greece',
      csrf: getState().user.csrf
    }, profile);

    dispatch(requestedQuery());

    return userAPI.saveToProfile(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);
      }
      return response;
    }).catch(function (errors) {
      console.error('Error caught on saveToProfile:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var saveConfiguration = function saveConfiguration(configuration) {
  return function (dispatch, getState) {
    return dispatch(saveToProfile({
      configuration: JSON.stringify(_extends({}, JSON.parse(getState().user.profile.configuration), configuration))
    }));
  };
};

var updateDevice = function updateDevice(update) {
  return function (dispatch, getState) {
    var data = {
      csrf: getState().user.csrf,
      updates: [filterObj(update, ['name', 'key', 'type', 'properties'])]
    };

    dispatch(requestedQuery());

    return deviceAPI.updateDevice(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      if (response.success) {
        setTimeout(function () {
          dispatch(resetSuccess());
        }, SUCCESS_SHOW_TIMEOUT);
      }

      if (!response || !response.success) {
        throwServerError(response);
      }
      return response;
    }).catch(function (errors) {
      console.error('Error caught on updateDevice:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var requestPasswordReset = function requestPasswordReset(username) {
  return function (dispatch, getState) {
    var data = {
      username: username,
      application: 'HOME',
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return userAPI.requestPasswordReset(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      if (response.success) {
        dispatch(resetSuccess());
        dispatch(dismissError());
        dispatch(setInfo('passwordMailSent'));
      }

      if (!response || !response.success) {
        throwServerError(response);
      }
      return response;
    }).catch(function (errors) {
      console.error('Error caught on requestPasswordReset:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var resetPassword = function resetPassword(password, token, captcha) {
  return function (dispatch, getState) {
    var data = {
      token: token,
      password: password,
      captcha: captcha,
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return userAPI.resetPassword(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));

      if (!response || !response.success) {
        throwServerError(response);
      }

      dispatch(dismissError());
      return new Promise(function (resolve, reject) {
        return setTimeout(function () {
          dispatch(resetSuccess());
          return resolve(response);
        }, SUCCESS_SHOW_TIMEOUT);
      });
    }).catch(function (errors) {
      console.error('Error caught on resetPassword:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var changePassword = function changePassword(password, captcha) {
  return function (dispatch, getState) {
    var data = {
      password: password,
      captcha: captcha,
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return userAPI.changePassword(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));

      if (!response || !response.success) {
        throwServerError(response);
      }

      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);
      return response;
    }).catch(function (errors) {
      console.error('Error caught on changePassword:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  login: login,
  logout: logout,
  refreshProfile: refreshProfile,
  fetchProfile: fetchProfile,
  saveToProfile: saveToProfile,
  saveConfiguration: saveConfiguration,
  updateDevice: updateDevice,
  letTheRightOneIn: letTheRightOneIn,
  requestPasswordReset: requestPasswordReset,
  resetPassword: resetPassword,
  changePassword: changePassword,
  setChangePassword: setChangePassword,
  resetChangePassword: resetChangePassword
};