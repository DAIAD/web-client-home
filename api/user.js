const callAPI = require('./base');
const formAPI = require('./form');

const UserAPI = {
  login: function (username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return formAPI('/login?application=home', { formData });
  },
  logout: function (data) {
    return formAPI('/logout', data);
  },
  getProfile: function () {
    return callAPI('/action/profile/load', {}, 'GET');
  },
  saveToProfile: function (data) {
    return callAPI('/action/profile/save', data);
  },
  requestPasswordReset: function (data) {
    return callAPI('/action/user/password/reset/token/create', data);
  },
  resetPassword: function (data) {
    return callAPI('/action/user/password/reset/token/redeem', data);
  },
  saveMembers: function (data) {
    return callAPI('/action/household', data);
  },
};

module.exports = UserAPI;

