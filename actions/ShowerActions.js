const types = require('../constants/ActionTypes');
const { requestedQuery, receivedQuery, setSuccess, resetSuccess, setError } = require('./QueryActions');
const { clearCacheItems } = require('./CacheActions');

const showersAPI = require('../api/showers');

const { throwServerError } = require('../utils/general');

const { SUCCESS_SHOW_TIMEOUT } = require('../constants/HomeConstants');

const assignToMember = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, sessionId, memberIndex } = options;

    const data = {
      assignments: [{
        deviceKey,
        sessionId,
        memberIndex,
        timestamp: new Date().valueOf(),
      }],
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return showersAPI.assignToMember(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(setSuccess());
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      dispatch(clearCacheItems(getState().query.cache, 'AMPHIRO', deviceKey, sessionId));

      return response;
    })
    .catch((errors) => {
      console.error('Error caught on assign shower to member:', errors);
      dispatch(setError(errors));
      return errors;
    });
  };
};

const ignoreShower = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, sessionId } = options;

    const data = {
      sessions: [{
        deviceKey,
        sessionId,
        timestamp: new Date().valueOf(),
      }],
      csrf: getState().user.csrf,
    };  
    dispatch(requestedQuery());

    return showersAPI.ignoreShower(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(setSuccess());
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      dispatch(clearCacheItems(getState().query.cache, 'AMPHIRO', deviceKey, sessionId));

      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on ignore shower:', errors);
      dispatch(setError(errors));
      return errors;
    });
  };
};

const setShowerReal = function (options) {
  return function (dispatch, getState) {
    const { deviceKey, sessionId, timestamp } = options;

    const data = {
      deviceKey,
      sessionId,
      timestamp,
      csrf: getState().user.csrf,
    };  
    dispatch(requestedQuery());

    return showersAPI.setShowerReal(data)
    .then((response) => {
      dispatch(receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      dispatch(setSuccess());
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      dispatch(clearCacheItems(getState().query.cache, 'AMPHIRO', deviceKey, sessionId));

      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on set shower real:', errors);
      dispatch(setError(errors));
      return errors;
    });
  };
};

module.exports = {
  assignToMember,
  ignoreShower,
  setShowerReal,
};

