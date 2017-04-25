const React = require('react');
const { normalizeMetric } = require('../../utils/general');

function DisplayMetric(props) {
  const { className } = props;
  const value = normalizeMetric(props.value);
  return (
    <span className={className}>
      { value[0] != null ? 
        <span>
        <span>{value[0]}</span>
        <span style={{ fontSize: '0.6em' }}> {value[1]}</span>
      </span>
      :
        <span />
      }
    </span>
  );
}

module.exports = DisplayMetric;
