const React = require('react');
const { FormattedHTMLMessage } = require('react-intl');

function ErrorDisplay(props) {
  const { _t, imgPrefix, errors, dismissError } = props;
  const message = errors && errors.message;
  return errors ? 
    <div className="error-display">
      <button onClick={() => dismissError()} className="btn-a error-display-x">x</button>
      <img src={`${imgPrefix}/alert.svg`} alt="error" />
      <span className="widget-error">
        <FormattedHTMLMessage id={`errors.${message}`} />
      </span>
    </div>
    :
    <div />;
}

module.exports = ErrorDisplay;
