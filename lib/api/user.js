'use strict';

var callAPI = require('./base');
var formAPI = require('./form');

var UserAPI = {
  login: function login(username, password) {
    var formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return formAPI('/login?application=home', { formData: formData });
  },
  logout: function logout(data) {
    return formAPI('/logout', data);
  },
  getProfile: function getProfile() {
    return callAPI('/action/profile/load', {}, 'GET');
  },
  saveToProfile: function saveToProfile(data) {
    return callAPI('/action/profile/save', data);
  },
  requestPasswordReset: function requestPasswordReset(data) {
    return callAPI('/action/user/password/reset/token/create', data);
  },
  resetPassword: function resetPassword(data) {
    return callAPI('/action/user/password/reset/token/redeem', data);
  },
  changePassword: function changePassword(data) {
    return callAPI('/action/user/password/change', data);
  },
  saveMembers: function saveMembers(data) {
    return callAPI('/action/household', data);
  }
};

module.exports = UserAPI;