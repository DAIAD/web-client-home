'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

function Footer() {
  return React.createElement(
    'footer',
    { className: 'site-footer' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'ul',
        { style: { listStyle: 'none', textAlign: 'center' } },
        React.createElement(
          'li',
          { style: { display: 'inline-block' } },
          React.createElement(
            'a',
            { href: '/' },
            '2017 DAIAD'
          )
        ),
        React.createElement(
          'li',
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            'a',
            { href: 'http://daiad.eu' },
            'daiad.eu'
          )
        ),
        React.createElement(
          'li',
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            'a',
            { href: '/' },
            React.createElement(FormattedMessage, { id: 'footer.terms' })
          )
        ),
        React.createElement(
          'li',
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            'a',
            { href: '/' },
            React.createElement(FormattedMessage, { id: 'footer.contact' })
          )
        )
      )
    )
  );
}

module.exports = Footer;