'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var MainSection = require('../../../layout/MainSection');
var Dropdown = require('../../../helpers/Dropdown');
var DeviceDetails = require('./DeviceDetails');

var _require2 = require('../../../../utils/device'),
    deviceToDeviceForm = _require2.deviceToDeviceForm;

var _require3 = require('../../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES,
    AMPHIRO_PROPERTIES = _require3.AMPHIRO_PROPERTIES;

function DevicesForm(props) {
  var intl = props.intl,
      _t = props._t,
      devices = props.devices,
      deviceForm = props.deviceForm,
      actions = props.actions;
  var updateDevice = actions.updateDevice,
      updateDeviceForm = actions.updateDeviceForm,
      fetchProfile = actions.fetchProfile;

  return React.createElement(
    'div',
    null,
    React.createElement(
      bs.Accordion,
      {
        className: 'col-xs-10',
        onSelect: function onSelect(val) {
          updateDeviceForm(deviceToDeviceForm(devices.find(function (d) {
            return d.deviceKey === val;
          })));
        }
      },
      devices.map(function (device) {
        return React.createElement(
          bs.Panel,
          {
            key: device.deviceKey,
            header: device.type === 'AMPHIRO' ? React.createElement(
              'h3',
              null,
              React.createElement('img', { style: { marginRight: 5 }, src: IMAGES + '/amphiro_small.svg', alt: 'devices' }),
              device.name || device.deviceKey
            ) : React.createElement(
              'h3',
              null,
              React.createElement('img', { style: { marginRight: 5 }, src: IMAGES + '/water-meter.svg', alt: 'meters' }),
              _t('devices.meter')
            ),
            eventKey: device.deviceKey
          },
          React.createElement(DeviceDetails, {
            fetchProfile: fetchProfile,
            updateForm: updateDeviceForm,
            updateDevice: updateDevice,
            _t: _t,
            intl: intl,
            deviceForm: deviceForm
          })
        );
      })
    )
  );
}

function Devices(props) {
  return React.createElement(
    MainSection,
    { id: 'section.devices' },
    React.createElement(
      'div',
      { style: { margin: 20 } },
      React.createElement(DevicesForm, props)
    )
  );
}

module.exports = Devices;