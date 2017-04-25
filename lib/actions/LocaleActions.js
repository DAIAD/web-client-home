'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Locale Actions module.
 * I18N related action creators
 * 
 * @module LocaleActions
 */

var localeAPI = require('../api/locales');
var types = require('../constants/ActionTypes');

var _require = require('./QueryActions'),
    requestedQuery = _require.requestedQuery,
    receivedQuery = _require.receivedQuery,
    resetSuccess = _require.resetSuccess;

var _require2 = require('../utils/general'),
    flattenMessages = _require2.flattenMessages;

var setCsrf = function setCsrf(csrf) {
  return {
    type: types.USER_SESSION_SET_CSRF,
    csrf: csrf
  };
};

var receivedMessages = function receivedMessages(locale, messages) {
  return {
    type: types.LOCALE_RECEIVED_MESSAGES,
    locale: locale,
    messages: messages
  };
};

/**
 * Fetches locale strings
 *
 * @param {String} locale - One of en, el, es, de, fr
 * @return {Promise} Resolved or rejected promise 
 * with locale strings if resolved, errors if rejected
 */
var fetchLocaleMessages = function fetchLocaleMessages(locale) {
  return function (dispatch, getState) {
    dispatch(requestedQuery());

    return localeAPI.fetchLocaleMessages({ locale: locale }).then(function (response) {
      var messages = _extends({}, response);
      var csrf = messages.csrf;

      delete messages.csrf;

      if (csrf) {
        dispatch(setCsrf(csrf));
      }

      dispatch(receivedQuery(true, null));
      dispatch(resetSuccess());

      dispatch(receivedMessages(locale, flattenMessages(messages)));
      return messages;
    }).catch(function (errors) {
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

/**
 * Sets locale and fetches locale strings
 *
 * @param {String} locale - One of en, el, es, de, fr 
 * @return {Promise} Resolved or rejected promise 
 * with locale strings if resolved, errors if rejected
 */
var setLocale = function setLocale(locale) {
  return function (dispatch, getState) {
    if (getState().locale.locale === locale) {
      return Promise.resolve(true);
    }
    return dispatch(fetchLocaleMessages(locale));
  };
};

module.exports = {
  fetchLocaleMessages: fetchLocaleMessages,
  setLocale: setLocale
};