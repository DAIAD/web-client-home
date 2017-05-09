'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

function QuerySuccess() {
  return React.createElement(
    'div',
    { className: 'query-success' },
    React.createElement(
      'h4',
      null,
      React.createElement('img', { src: IMAGES + '/success.svg', alt: 'success' }),
      '\xA0',
      React.createElement(FormattedMessage, { id: 'forms.saved' })
    )
  );
}

module.exports = QuerySuccess;