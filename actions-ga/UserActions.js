const ReactGA = require('react-ga');

const Actions = require('../actions/UserActions');

const login = function (username, password) {
  return function (dispatch, getState) {
    return dispatch(Actions.login(username, password))
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'login',
      });
      return response;
    });
  };
};

const logout = function () {
  return function (dispatch, getState) {
    return dispatch(Actions.logout())
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'logout',
      });
      return response;
    });
  };
};

const refreshProfile = function () {
  return function (dispatch, getState) {
    return dispatch(Actions.refreshProfile())
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'refreshed',
      });
      return response;
    });
  };
};

const saveToProfile = function (profile) {
  return function (dispatch, getState) {
    return dispatch(Actions.saveToProfile(profile))
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'saved',
      });
      return response;
    });
  };
};

const updateDevice = function (update) {
  return function (dispatch, getState) {
    return dispatch(Actions.updateDevice(update))
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'saved devices',
      });
      return response;
    });
  };
};

const requestPasswordReset = function (username) {
  ReactGA.event({
    category: 'profile',
    action: 'request password reset',
  });
  return Actions.requestPasswordReset(username);
};

const resetPassword = function (password, token, captcha) {
  return function (dispatch, getState) {
    return dispatch(Actions.resetPassword(password, token, captcha))
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'reset password',
      });
      return response;
    });
  };
};

const changePassword = function (password, captcha) {
  return function (dispatch, getState) {
    return dispatch(Actions.changePassword(password, captcha))
    .then((response) => {
      ReactGA.event({
        category: 'profile',
        action: 'changed password',
      });
      return response;
    });
  };
};

module.exports = {
  ...Actions,
  login,
  logout,
  refreshProfile,
  saveToProfile,
  updateDevice,
  requestPasswordReset,
  resetPassword,
  changePassword,
};
