'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedHTMLMessage = _require.FormattedHTMLMessage;

function ErrorDisplay(props) {
  var _t = props._t,
      imgPrefix = props.imgPrefix,
      errors = props.errors,
      dismissError = props.dismissError;

  var message = errors && errors.message;
  return errors ? React.createElement(
    'div',
    { className: 'error-display' },
    React.createElement(
      'button',
      { onClick: function onClick() {
          return dismissError();
        }, className: 'btn-a error-display-x' },
      'x'
    ),
    React.createElement('img', { src: imgPrefix + '/alert.svg', alt: 'error' }),
    React.createElement(
      'span',
      { className: 'widget-error' },
      React.createElement(FormattedHTMLMessage, { id: 'errors.' + message })
    )
  ) : React.createElement('div', null);
}

module.exports = ErrorDisplay;