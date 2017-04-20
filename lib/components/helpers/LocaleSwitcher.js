'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('../../constants/HomeConstants'),
    LOCALES = _require.LOCALES;

function LocaleSwitcher(props) {
  var locale = props.locale,
      _t = props._t,
      _props$id = props.id,
      id = _props$id === undefined ? 'language-switcher' : _props$id;

  return React.createElement(
    bs.DropdownButton,
    {
      title: _t('locale.' + locale),
      id: id,
      defaultValue: locale,
      onSelect: function onSelect(e, val) {
        return props.setLocale(val);
      }
    },
    LOCALES.map(function (lang) {
      return React.createElement(
        bs.MenuItem,
        {
          key: lang,
          eventKey: lang,
          value: lang
        },
        _t('locale.' + lang)
      );
    })
  );
}

module.exports = LocaleSwitcher;