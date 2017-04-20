'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

function MeterProperties(props) {
  var _t = props._t,
      updateForm = props.updateForm,
      deviceForm = props.deviceForm;
  var properties = deviceForm.properties;

  return React.createElement(
    'span',
    null,
    React.createElement(FormattedMessage, { id: 'devices.no-properties' })
  );
}

module.exports = MeterProperties;