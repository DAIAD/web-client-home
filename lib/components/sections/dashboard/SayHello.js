'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

/* Be Polite, greet user */


function SayHello(props) {
  return React.createElement(
    'div',
    { style: { margin: '40px 30px 20px 30px' } },
    React.createElement(
      'h3',
      null,
      React.createElement(FormattedMessage, {
        id: 'dashboard.hello',
        values: { name: props.firstname }
      })
    )
  );
}

module.exports = SayHello;