'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var callAPI = require('./base');

var CommonsAPI = {
  createCommon: function createCommon(data) {
    return callAPI('/action/commons', data, 'PUT');
  },
  updateCommon: function updateCommon(_ref) {
    var key = _ref.key,
        data = _objectWithoutProperties(_ref, ['key']);

    return callAPI('/action/commons/' + key, data, 'POST');
  },
  deleteCommon: function deleteCommon(_ref2) {
    var key = _ref2.key,
        csrf = _ref2.csrf;

    return callAPI('/action/commons/' + key, { csrf: csrf }, 'DELETE');
  },
  getCommons: function getCommons(_ref3) {
    var csrf = _ref3.csrf;

    return callAPI('/action/commons/membership', { csrf: csrf }, 'GET');
  },
  joinCommon: function joinCommon(_ref4) {
    var key = _ref4.key,
        csrf = _ref4.csrf;

    return callAPI('/action/commons/' + key + '/join', { csrf: csrf }, 'PUT');
  },
  leaveCommon: function leaveCommon(_ref5) {
    var key = _ref5.key,
        csrf = _ref5.csrf;

    return callAPI('/action/commons/' + key + '/leave', { csrf: csrf }, 'DELETE');
  },
  searchCommons: function searchCommons(data) {
    return callAPI('/action/commons', data, 'POST');
  },
  getCommonMembers: function getCommonMembers(_ref6) {
    var key = _ref6.key,
        data = _objectWithoutProperties(_ref6, ['key']);

    return callAPI('/action/commons/' + key + '/members', data, 'POST');
  }
};

module.exports = CommonsAPI;