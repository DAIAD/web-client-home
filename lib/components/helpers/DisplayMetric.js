'use strict';

var React = require('react');

var _require = require('../../utils/general'),
    normalizeMetric = _require.normalizeMetric;

function DisplayMetric(props) {
  var className = props.className;

  var value = normalizeMetric(props.value);
  return React.createElement(
    'span',
    { className: className },
    value[0] != null ? React.createElement(
      'span',
      null,
      React.createElement(
        'span',
        null,
        value[0]
      ),
      React.createElement(
        'span',
        { style: { fontSize: '0.6em' } },
        ' ',
        value[1]
      )
    ) : React.createElement('span', null)
  );
}

module.exports = DisplayMetric;