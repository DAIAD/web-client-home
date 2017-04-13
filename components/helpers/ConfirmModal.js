const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

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
          <FormattedMessage id="forms.confirm-title" />
        </bs.Modal.Title>
      </bs.Modal.Header>
      <bs.Modal.Body>
        <span>{message}</span>
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <button 
          className="btn-a"
          style={{ marginRight: 20 }} 
          onClick={onClose}
        >
          <FormattedMessage id="forms.no" />
        </button>
        <button 
          className="btn-a"
          onClick={onConfirm}
        >
          <FormattedMessage id="forms.yes" />
        </button>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

module.exports = Confirm;
