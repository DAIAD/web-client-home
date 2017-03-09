const React = require('react');
const bs = require('react-bootstrap');

const { LOCALES } = require('../constants/HomeConstants');

function LocaleSwitcher(props) {
  const { locale, _t, id = 'language-switcher' } = props;
  return (
    <bs.DropdownButton
      title={_t(`locale.${locale}`)}
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
            {_t(`locale.${lang}`)}
          </bs.MenuItem>
        ))
      } 
    </bs.DropdownButton>
  );
}

module.exports = LocaleSwitcher;
