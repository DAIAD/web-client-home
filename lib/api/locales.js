'use strict';

var callAPI = require('./base');

var _require = require('../constants/HomeConstants'),
    LOCALES = _require.LOCALES;

var LocaleAPI = {
  fetchLocaleMessages: function fetchLocaleMessages(data) {
    var locale = data.locale;

    if (!LOCALES.includes(locale)) throw new Error('locale ' + locale + ' not supported');

    return callAPI('/assets/js/home/i18n/' + locale + '.json', {}, 'GET');
  }
};

module.exports = LocaleAPI;