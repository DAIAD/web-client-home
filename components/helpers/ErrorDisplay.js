const React = require('react');
const { FormattedMessage } = require('react-intl');

function ErrorDisplay(props) {
  const { _t, imgPrefix, errors, dismissError } = props;
  return errors ? 
    <div className="error-display">
      <a onClick={() => dismissError()} className="error-display-x">x</a>
      <img src={`${imgPrefix}/alert.svg`} alt="error" />
      <span className="widget-error">
        <FormattedMessage id={`errors.${errors}`} />
      </span>
    </div>
    :
    <div />;
}

module.exports = ErrorDisplay;
