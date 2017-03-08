const React = require('react');
const bs = require('react-bootstrap');

function Confirm(props) {
  const { show, onClose, onConfirm, message } = props;
  return (
    <bs.Modal 
      animation={false} 
      show={show}
      onHide={onClose} 
      dialogClassName="confirmation-modal"
      bsSize="sm"
    >
      <bs.Modal.Header closeButton>
        <bs.Modal.Title>
         Confirmation 
        </bs.Modal.Title>
      </bs.Modal.Header>
      <bs.Modal.Body>
        <span>{message}</span>
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <a style={{ marginRight: 20 }} onClick={onClose}>No</a>
        <a onClick={onConfirm}>Yes</a>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

module.exports = Confirm;
