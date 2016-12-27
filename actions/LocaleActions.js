/**
 * Locale Actions module.
 * I18N related action creators
 * 
 * @module LocaleActions
 */

const localeAPI = require('../api/locales');
const types = require('../constants/ActionTypes');

const { flattenMessages } = require('../utils/general');

const receivedMessages = function (success, errors, locale, messages) {
  return {
    type: types.LOCALE_RECEIVED_MESSAGES,
    success,
    errors,
    locale,
    messages,
  };
};

const requestedLocaleMessages = function (locale) {
  return {
    type: types.LOCALE_REQUEST_MESSAGES,
    locale,
  };
};

/**
 * Fetches locale strings
 *
 * @param {String} locale - One of en, el, es, de, fr
 * @return {Promise} Resolved or rejected promise 
 * with locale strings if resolved, errors if rejected
 */
const fetchLocaleMessages = function (locale) {
  return function (dispatch, getState) {
    return localeAPI.fetchLocaleMessages({ locale })
    .then((messages) => {
      dispatch(receivedMessages(true, null, locale, flattenMessages(messages)));
      return messages;
    })
    .catch((errors) => {
      dispatch(receivedMessages(false, errors, null, []));
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
const setLocale = function (locale) {
  return function (dispatch, getState) {
    if (getState().locale.locale === locale) {
      return Promise.resolve(true);
    }
    // dispatch request messages to update state
    dispatch(requestedLocaleMessages(locale));
    // dispatch fetch messages to call API
    return dispatch(fetchLocaleMessages(locale));
  };
};

module.exports = {
  fetchLocaleMessages,
  setLocale,
};
