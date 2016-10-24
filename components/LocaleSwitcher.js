var React = require('react');
var bs = require('react-bootstrap');

const { LOCALES } = require('../constants/HomeConstants');

function LocaleSwitcher (props) {
  const { locale, intl } = props;
  const _t = intl.formatMessage;
  const translationKey = `locale.${locale}`;
  return (
      <bs.DropdownButton
        title={_t({ id: translationKey})}
        id="language-switcher"
        defaultValue={locale}
        onSelect={(e, val) => props.setLocale(val)}>
        {
          LOCALES.map(function(locale) {
            const translationKey = `locale.${locale}`;
            return (
              <bs.MenuItem key={locale} eventKey={locale} value={locale} >{_t({ id: translationKey})}</bs.MenuItem>
            );
        })
        } 
      </bs.DropdownButton>
  );
}

module.exports = LocaleSwitcher;
