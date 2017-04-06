'use strict';

var React = require('react');
var bs = require('react-bootstrap');

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
        'Confirmation'
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
        'a',
        { style: { marginRight: 20 }, onClick: onClose },
        'No'
      ),
      React.createElement(
        'a',
        { onClick: onConfirm },
        'Yes'
      )
    )
  );
}

module.exports = Confirm;