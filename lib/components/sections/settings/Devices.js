'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var MainSection = require('../../layout/MainSection');

var _require2 = require('../../../utils/device'),
    deviceToDeviceForm = _require2.deviceToDeviceForm,
    deviceFormToDevice = _require2.deviceFormToDevice;

var _require3 = require('../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES,
    HEATING_SYSTEMS = _require3.HEATING_SYSTEMS,
    AMPHIRO_PROPERTIES = _require3.AMPHIRO_PROPERTIES;

function DropdownProperty(props) {
  var _t = props._t,
      id = props.id,
      type = props.type,
      options = props.options,
      value = props.value,
      update = props.update;

  return React.createElement(
    'div',
    { className: 'form-group' },
    React.createElement(
      'label',
      {
        className: 'control-label col-md-3',
        style: { paddingLeft: 0 },
        htmlFor: id + '-switcher'
      },
      React.createElement(
        'span',
        null,
        React.createElement(FormattedMessage, { id: 'devices.' + id + '.label' })
      )
    ),
    React.createElement(
      bs.DropdownButton,
      {
        title: value != null ? _t('devices.' + id + '.' + value) : _t('devices.' + id + '.default'),
        id: id + '-switcher',
        value: value,
        onSelect: function onSelect(e, val) {
          update(val);
        }
      },
      options.map(function (option) {
        return React.createElement(
          bs.MenuItem,
          {
            key: option,
            eventKey: option,
            value: option
          },
          _t('devices.' + id + '.' + option)
        );
      })
    )
  );
}

function InputProperty(props) {
  var _t = props._t,
      id = props.id,
      type = props.type,
      options = props.options,
      value = props.value,
      update = props.update;

  return React.createElement(bs.Input, _extends({
    value: value,
    style: { maxWidth: 200 },
    onChange: function onChange(e) {
      return update(e.target.value);
    },
    label: _t('devices.' + id + '.label'),
    help: _t('devices.' + id + '.help')
  }, options));
}

function Device(props) {
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
      value: _t('forms.submit')
    }) : React.createElement('div', null)
  );
}

function AmphiroProperties(props) {
  var _t = props._t,
      updateForm = props.updateForm,
      deviceForm = props.deviceForm;

  return React.createElement(
    'div',
    null,
    AMPHIRO_PROPERTIES.map(function (property) {
      if (property.type === 'input') {
        return React.createElement(InputProperty, {
          key: property.id,
          _t: _t,
          id: property.id,
          value: deviceForm[property.id],
          update: function update(val) {
            var d = {};d[property.id] = val;updateForm(d);
          },
          options: property.options
        });
      } else if (property.type === 'select') {
        return React.createElement(DropdownProperty, {
          key: property.id,
          _t: _t,
          id: property.id,
          value: deviceForm[property.id],
          update: function update(val) {
            var d = {};d[property.id] = val;updateForm(d);
          },
          options: property.options
        });
      }
      return React.createElement('div', null);
    })
  );
}

function MeterProperties(props) {
  var _t = props._t,
      updateForm = props.updateForm,
      deviceForm = props.deviceForm;
  var properties = deviceForm.properties;

  return React.createElement(
    'span',
    null,
    'No properties'
  );
}

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
          React.createElement(Device, {
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