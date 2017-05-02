'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

var reports = [{
  id: 'id',
  name: '',
  value: function value() {
    return '';
  }
}, {
  id: 'period',
  name: React.createElement(FormattedMessage, { id: 'reports.period' }),
  icon: 'calendar'
}, {
  id: 'createdOn',
  name: React.createElement(FormattedMessage, { id: 'reports.created' }),
  value: function value(_value) {
    return React.createElement(FormattedDate, { value: _value });
  }
}, {
  id: 'size',
  name: React.createElement(FormattedMessage, { id: 'reports.size' })
}, {
  id: 'url',
  name: '',
  value: function value(_value2) {
    return React.createElement(
      'a',
      { href: _value2 },
      React.createElement('i', { className: 'fa fa-download navy', style: { marginRight: 10 } }),
      React.createElement(FormattedMessage, { id: 'forms.download' })
    );
  }
}];

module.exports = {
  reports: reports
};