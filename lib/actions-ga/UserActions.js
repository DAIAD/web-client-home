'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/UserActions');

var login = function login(username, password) {
  return function (dispatch, getState) {
    return dispatch(Actions.login(username, password)).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'login'
      });
      return response;
    });
  };
};

var logout = function logout() {
  return function (dispatch, getState) {
    return dispatch(Actions.logout()).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'logout'
      });
      return response;
    });
  };
};

var refreshProfile = function refreshProfile() {
  return function (dispatch, getState) {
    return dispatch(Actions.refreshProfile()).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'refreshed'
      });
      return response;
    });
  };
};

var saveToProfile = function saveToProfile(profile) {
  return function (dispatch, getState) {
    return dispatch(Actions.saveToProfile(profile)).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'saved'
      });
      return response;
    });
  };
};

var updateDevice = function updateDevice(update) {
  return function (dispatch, getState) {
    return dispatch(Actions.updateDevice(update)).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'saved devices'
      });
      return response;
    });
  };
};

var requestPasswordReset = function requestPasswordReset(username) {
  ReactGA.event({
    category: 'profile',
    action: 'request password reset'
  });
  return Actions.requestPasswordReset(username);
};

var resetPassword = function resetPassword(password, token, captcha) {
  return function (dispatch, getState) {
    return dispatch(Actions.resetPassword(password, token, captcha)).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'reset password'
      });
      return response;
    });
  };
};

var changePassword = function changePassword(password, captcha) {
  return function (dispatch, getState) {
    return dispatch(Actions.changePassword(password, captcha)).then(function (response) {
      ReactGA.event({
        category: 'profile',
        action: 'changed password'
      });
      return response;
    });
  };
};

module.exports = _extends({}, Actions, {
  login: login,
  logout: logout,
  refreshProfile: refreshProfile,
  saveToProfile: saveToProfile,
  updateDevice: updateDevice,
  requestPasswordReset: requestPasswordReset,
  resetPassword: resetPassword,
  changePassword: changePassword
});