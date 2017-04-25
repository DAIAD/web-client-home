'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var AmphiroProperties = require('./AmphiroProperties');
var MeterProperties = require('./MeterProperties');

var _require2 = require('../../../../utils/device'),
    deviceFormToDevice = _require2.deviceFormToDevice;

function DeviceDetails(props) {
  var intl = props.intl,
      _t = props._t,
      updateDevice = props.updateDevice,
      updateForm = props.updateForm,
      fetchProfile = props.fetchProfile,
      deviceForm = props.deviceForm;
  var name = deviceForm.name,
      key = deviceForm.key,
      macAddress = deviceForm.macAddress,
      type = deviceForm.type,
      serial = deviceForm.serial,
      registeredOn = deviceForm.registeredOn,
      unit = deviceForm.unit,
      properties = deviceForm.properties;
  var _props$intl = props.intl,
      formatMessage = _props$intl.formatMessage,
      formatDate = _props$intl.formatDate,
      formatTime = _props$intl.formatTime;


  return React.createElement(
    'form',
    {
      className: 'col-md-8',
      style: { minWidth: 265 },
      onSubmit: function onSubmit(e) {
        e.preventDefault();
        //Meter not supported
        if (type === 'METER') return;
        updateDevice(deviceFormToDevice(deviceForm)).then(function (p) {
          fetchProfile();
        });
      }
    },
    type === 'AMPHIRO' ? React.createElement(bs.Input, {
      type: 'text',
      value: name,
      onChange: function onChange(e) {
        return updateForm({ name: e.target.value });
      },
      label: _t('devices.name.label')
    }) : React.createElement('div', null),
    React.createElement(bs.Input, {
      type: 'text',
      value: key,
      label: _t('devices.key.label'),
      readOnly: true
    }),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('devices.registeredOn.label'),
      value: formatDate(new Date(registeredOn)) + ' ' + formatTime(new Date(registeredOn)),
      readOnly: true
    }),
    function () {
      if (type === 'AMPHIRO') {
        return React.createElement(bs.Input, {
          type: 'text',
          label: _t('devices.mac.label'),
          value: macAddress,
          readOnly: true
        });
      } else if (type === 'METER') {
        return React.createElement(bs.Input, {
          type: 'text',
          label: _t('devices.serial.label'),
          value: serial,
          readOnly: true
        });
      }
      return React.createElement('div', null);
    }(),
    React.createElement('br', null),
    React.createElement(
      'h4',
      null,
      React.createElement(FormattedMessage, { id: 'devices.properties' })
    ),
    React.createElement('hr', null),
    type === 'AMPHIRO' ? React.createElement(AmphiroProperties, {
      _t: _t,
      updateForm: updateForm,
      deviceForm: deviceForm
    }) : React.createElement(MeterProperties, _extends({
      _t: _t
    }, props)),
    type === 'AMPHIRO' ? React.createElement(bs.ButtonInput, {
      style: { marginTop: 20, float: 'right' },
      type: 'submit',
      value: _t('forms.update')
    }) : React.createElement('div', null)
  );
}

module.exports = DeviceDetails;