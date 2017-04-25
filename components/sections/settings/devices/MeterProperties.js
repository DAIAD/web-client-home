const React = require('react');
const { FormattedMessage } = require('react-intl');

function MeterProperties(props) {
  const { _t, updateForm, deviceForm } = props;
  const { properties } = deviceForm;
  return (
    <span><FormattedMessage id="devices.no-properties" /></span>
  );
}

module.exports = MeterProperties;

