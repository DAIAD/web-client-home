'use strict';

var types = require('../constants/ActionTypes');

var _require = require('./QueryActions'),
    requestedQuery = _require.requestedQuery,
    receivedQuery = _require.receivedQuery,
    resetSuccess = _require.resetSuccess;

var _require2 = require('./CacheActions'),
    clearCacheItems = _require2.clearCacheItems;

var showersAPI = require('../api/showers');

var _require3 = require('../utils/general'),
    throwServerError = _require3.throwServerError;

var _require4 = require('../constants/HomeConstants'),
    SUCCESS_SHOW_TIMEOUT = _require4.SUCCESS_SHOW_TIMEOUT;

var assignToMember = function assignToMember(options) {
  return function (dispatch, getState) {
    var deviceKey = options.deviceKey,
        sessionId = options.sessionId,
        memberIndex = options.memberIndex;


    var data = {
      assignments: [{
        deviceKey: deviceKey,
        sessionId: sessionId,
        memberIndex: memberIndex,
        timestamp: new Date().valueOf()
      }],
      csrf: getState().user.csrf
    };

    dispatch(requestedQuery());

    return showersAPI.assignToMember(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);
      }

      dispatch(clearCacheItems('AMPHIRO', deviceKey, sessionId));

      return response;
    }).catch(function (errors) {
      console.error('Error caught on assign shower to member:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var ignoreShower = function ignoreShower(options) {
  return function (dispatch, getState) {
    var deviceKey = options.deviceKey,
        sessionId = options.sessionId;


    var data = {
      sessions: [{
        deviceKey: deviceKey,
        sessionId: sessionId,
        timestamp: new Date().valueOf()
      }],
      csrf: getState().user.csrf
    };
    dispatch(requestedQuery());

    return showersAPI.ignoreShower(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);
      }

      dispatch(clearCacheItems('AMPHIRO', deviceKey, sessionId));

      return response;
    }).catch(function (errors) {
      console.error('Error caught on ignore shower:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

var setShowerReal = function setShowerReal(options) {
  return function (dispatch, getState) {
    var deviceKey = options.deviceKey,
        sessionId = options.sessionId,
        timestamp = options.timestamp;


    var data = {
      deviceKey: deviceKey,
      sessionId: sessionId,
      timestamp: timestamp,
      csrf: getState().user.csrf
    };
    dispatch(requestedQuery());

    return showersAPI.setShowerReal(data).then(function (response) {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(function () {
        dispatch(resetSuccess());
      }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);
      }

      dispatch(clearCacheItems('AMPHIRO', deviceKey, sessionId));

      return response;
    }).catch(function (errors) {
      console.error('Error caught on set shower real:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  assignToMember: assignToMember,
  ignoreShower: ignoreShower,
  setShowerReal: setShowerReal
};