'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var Dropdown = require('../../../helpers/Dropdown');

var _require = require('../../../../constants/HomeConstants'),
    AMPHIRO_PROPERTIES = _require.AMPHIRO_PROPERTIES;

function AmphiroProperties(props) {
  var _t = props._t,
      updateForm = props.updateForm,
      deviceForm = props.deviceForm;

  return React.createElement(
    'div',
    null,
    AMPHIRO_PROPERTIES.map(function (property) {
      if (property.type === 'input') {
        return React.createElement(bs.Input, _extends({
          id: deviceForm.name + '-' + property.id,
          style: { maxWidth: 200 },
          type: property.type,
          value: deviceForm[property.id],
          onChange: function onChange(e) {
            var d = {};d[property.id] = e.target.value;updateForm(d);
          },
          label: _t('devices.' + property.id + '.label'),
          help: _t('devices.' + property.id + '.help')
        }, property.options));
      } else if (property.type === 'select') {
        return React.createElement(Dropdown, {
          _t: _t,
          id: deviceForm.name + '-' + property.id,
          label: 'devices.' + property.id + '.label',
          titlePrefix: 'devices.' + property.id,
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

module.exports = AmphiroProperties;