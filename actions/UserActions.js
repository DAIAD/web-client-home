/**
 * User Actions module.
 * User related action creators
 * 
 * @module UserActions
 */
const { push } = require('react-router-redux');
const userAPI = require('../api/user');
const deviceAPI = require('../api/device');
const types = require('../constants/ActionTypes');

const InitActions = require('./InitActions');
const { resetSuccess, requestedQuery, receivedQuery, dismissError, setInfo } = require('./QueryActions');
const { SUCCESS_SHOW_TIMEOUT } = require('../constants/HomeConstants');
const { filterObj, throwServerError } = require('../utils/general');


const receivedLogin = function (profile) {
  return {
    type: types.USER_RECEIVED_LOGIN,
    profile,
  };
};

const receivedLogout = function () {
  return {
    type: types.USER_RECEIVED_LOGOUT,
  };
};

const setCsrf = function (csrf) {
  return {
    type: types.USER_SESSION_SET_CSRF,
    csrf,
  };
};

const setChangePassword = function () {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: true,
  };
};

const resetChangePassword = function () {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: false,
  };
};

/**
 * Action that is dispatched after authentication success
 * for optimization purposes 
 *
 * @return {Promise} Resolved or rejected promise with Object 
 * {success:true, profile{Object}} if resolved, {success: false} if rejected
 */
const letTheRightOneIn = function () {
  return {
    type: types.USER_LET_IN,
  };
};

/**
 * Fetches profile
 *
 * @return {Promise} Resolved or rejected promise with user profile if resolved, errors if rejected
 */

const fetchProfile = function () {
  return function (dispatch, getState) {
    return userAPI.getProfile()
    .then((response) => {
      const { csrf, success, errors, profile } = response;
      
      if (csrf) { dispatch(setCsrf(csrf)); }

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
const login = function (username, password) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    return userAPI.login(username, password)
    .then((response) => {
      const { csrf, success, errors, profile } = response;

      if (csrf) { dispatch(setCsrf(csrf)); }

      dispatch(receivedQuery(success, errors.length ? errors[0].code : null));

      // Actions that need to be dispatched on login
      if (success) {
        dispatch(dismissError());
        dispatch(receivedLogin(profile));
        return dispatch(InitActions.initHome(profile))
        .then(() => {
          dispatch(InitActions.setReady());
          dispatch(letTheRightOneIn());

          const transitionState = getState().routing.locationBeforeTransitions.state;
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
    })
    .catch((errors) => {
      console.error('Error caught on user login:', errors);
    });
  };
};

/**
 * Performs user logout 
 *
 * @return {Promise} Resolved or rejected promise, errors if rejected
 */
const logout = function () {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    const csrf = getState().user.csrf;

    return userAPI.logout({ csrf })
    .then((response) => {
      const { success, errors } = response;
    
      dispatch(push('/login'));
      dispatch(receivedQuery(success, errors.length ? errors[0].code : null));
      dispatch(receivedLogout());

      return response;
    })
    .catch((errors) => {
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
const refreshProfile = function () {
  return function (dispatch, getState) {
    dispatch(fetchProfile())
    .then((response) => {
      const { success, profile } = response;

      if (success) {
        // if refresh successful initialize
        dispatch(InitActions.initHome(profile))
        .then(() => {
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
    })
    .catch((errors) => {
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
const saveToProfile = function (profile) {
  return function (dispatch, getState) {
    // TODO: country is there because of bug in backend 
    // that sets it to null otherwise causing problems
    const data = {
      country: 'Greece', 
      csrf: getState().user.csrf,
      ...profile, 
    };

    dispatch(requestedQuery());

    return userAPI.saveToProfile(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);  
      }
      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on saveToProfile:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const updateDevice = function (update) {
  return function (dispatch, getState) {
    const data = {
      csrf: getState().user.csrf,
      updates: [filterObj(update, [
        'name',
        'key',
        'type',
        'properties',
      ])], 
    };

    dispatch(requestedQuery());

    return deviceAPI.updateDevice(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      if (response.success) {
        setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);
      }

      if (!response || !response.success) {
        throwServerError(response);  
      }
      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on updateDevice:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const requestPasswordReset = function (username) {
  return function (dispatch, getState) {
    const data = {
      username, 
      application: 'HOME',
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return userAPI.requestPasswordReset(data)
    .then((response) => {
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
    }) 
    .catch((errors) => {
      console.error('Error caught on requestPasswordReset:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const resetPassword = function (password, token, captcha) {
  return function (dispatch, getState) {
    const data = {
      token,
      password,
      captcha,
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return userAPI.resetPassword(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));

      if (!response || !response.success) {
        throwServerError(response);  
      }
      
      dispatch(dismissError()); 
      return new Promise((resolve, reject) => setTimeout(() => { 
          dispatch(resetSuccess()); 
          return resolve(response);
        }, SUCCESS_SHOW_TIMEOUT));
    }) 
    .catch((errors) => {
      console.error('Error caught on resetPassword:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

const changePassword = function (password, captcha) {
  return function (dispatch, getState) {
    const data = {
      password,
      captcha,
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return userAPI.changePassword(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      
      if (!response || !response.success) {
        throwServerError(response);  
      }

      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);
      return response;
    }) 
    .catch((errors) => {
      console.error('Error caught on changePassword:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  login,
  logout,
  refreshProfile,
  fetchProfile,
  saveToProfile,
  updateDevice,
  letTheRightOneIn,
  requestPasswordReset,
  resetPassword,
  changePassword,
  setChangePassword,
  resetChangePassword,
};
