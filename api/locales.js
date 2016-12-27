const callAPI = require('./base');
const { LOCALES } = require('../constants/HomeConstants');

const LocaleAPI = {
  fetchLocaleMessages: function (data) {
    const { locale } = data;
    if (!LOCALES.includes(locale)) throw new Error(`locale ${locale} not supported`);

    return callAPI(`/assets/js/build/home/i18n/${locale}.json`, {}, 'GET');
  } 
};

module.exports = LocaleAPI;

