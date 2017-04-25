'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

function Confirm(props) {
  var show = props.show,
      onClose = props.onClose,
      onConfirm = props.onConfirm,
      message = props.message;

  return React.createElement(
    bs.Modal,
    {
      animation: false,
      show: show,
      onHide: onClose,
      dialogClassName: 'confirmation-modal',
      bsSize: 'sm'
    },
    React.createElement(
      bs.Modal.Header,
      { closeButton: true },
      React.createElement(
        bs.Modal.Title,
        null,
        React.createElement(FormattedMessage, { id: 'forms.confirm-title' })
      )
    ),
    React.createElement(
      bs.Modal.Body,
      null,
      React.createElement(
        'span',
        null,
        message
      )
    ),
    React.createElement(
      bs.Modal.Footer,
      null,
      React.createElement(
        'button',
        {
          className: 'btn-a',
          style: { marginRight: 20 },
          onClick: onClose
        },
        React.createElement(FormattedMessage, { id: 'forms.no' })
      ),
      React.createElement(
        'button',
        {
          className: 'btn-a',
          onClick: onConfirm
        },
        React.createElement(FormattedMessage, { id: 'forms.yes' })
      )
    )
  );
}

module.exports = Confirm;