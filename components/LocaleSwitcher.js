const React = require('react');
const bs = require('react-bootstrap');

const { LOCALES } = require('../constants/HomeConstants');

function LocaleSwitcher(props) {
  const { locale, intl, id = 'language-switcher' } = props;
  const _t = intl.formatMessage;
  return (
    <bs.DropdownButton
      title={_t({ id: `locale.${locale}` })}
      id={id}
      defaultValue={locale}
      onSelect={(e, val) => props.setLocale(val)}
    >
      {
        LOCALES.map(lang => (
          <bs.MenuItem 
            key={lang} 
            eventKey={lang} 
            value={lang}
          >
            {_t({ id: `locale.${lang}` })}
          </bs.MenuItem>
        ))
      } 
    </bs.DropdownButton>
  );
}

module.exports = LocaleSwitcher;
