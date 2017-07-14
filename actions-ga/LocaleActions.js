const ReactGA = require('react-ga');

const Actions = require('../actions/LocaleActions');

const setLocale = function (locale) {
  ReactGA.event({
    category: 'locale',
    action: 'changed',
    label: locale.toString(),
  });
  return Actions.setLocale(locale);
};

module.exports = {
  ...Actions,
  setLocale,
};
