const callAPI = require('./base');

const CommonsAPI = {
  createCommon: function (data) {
    return callAPI('/action/commons', data, 'PUT');
  },
  updateCommon: function ({ key, ...data }) {
    return callAPI(`/action/commons/${key}`, data, 'POST');
  },
  deleteCommon: function ({ key, csrf }) {
    return callAPI(`/action/commons/${key}`, { csrf }, 'DELETE');
  },
  getCommons: function ({ csrf }) {
    return callAPI('/action/commons/membership', { csrf }, 'GET');
  },
  joinCommon: function ({ key, csrf }) {
    return callAPI(`/action/commons/${key}/join`, { csrf }, 'PUT');
  },
  leaveCommon: function ({ key, csrf }) {
    return callAPI(`/action/commons/${key}/leave`, { csrf }, 'DELETE');
  },
  searchCommons: function (data) {
    return callAPI('/action/commons', data, 'POST');
  },
  getCommonMembers: function ({ key, ...data }) {
    return callAPI(`/action/commons/${key}/members`, data, 'POST');
  },
};

module.exports = CommonsAPI;

