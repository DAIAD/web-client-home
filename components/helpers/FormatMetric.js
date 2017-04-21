const React = require('react');
const { validateMetric } = require('../../utils/general');

function FormatMetric(props) {
  const { className } = props;
  const value = validateMetric(props.value);
  return (
    <span className={className}>
      { value[0] != null ? 
        <span>
        <span>{value[0]}</span>
        <span style={{ fontSize: '0.6em' }}> {value[1]}</span>
      </span>
      :
      <span>-</span>
      }
    </span>
  );
}

module.exports = FormatMetric;
