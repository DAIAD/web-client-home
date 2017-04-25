'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

function Dropdown(props) {
  var _t = props._t,
      id = props.id,
      label = props.label,
      titlePrefix = props.titlePrefix,
      type = props.type,
      options = props.options,
      update = props.update;

  var value = props.value != null ? props.value : props.defaultValue;
  return React.createElement(
    'div',
    { className: 'form-group' },
    React.createElement(
      'label',
      {
        className: 'control-label',
        htmlFor: id
      },
      React.createElement(
        'span',
        null,
        React.createElement(FormattedMessage, { id: label })
      )
    ),
    React.createElement(
      bs.DropdownButton,
      {
        title: _t(titlePrefix + '.' + value),
        id: id,
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
          _t(titlePrefix + '.' + option)
        );
      })
    )
  );
}

module.exports = Dropdown;