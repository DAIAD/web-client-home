'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var _require2 = require('../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

var commons = [{
  id: 'key',
  name: 'Key'
}, {
  id: 'name',
  name: 'Name'
}, {
  id: 'membersCount',
  name: '# members'
}, {
  id: 'description',
  name: '',
  value: function value() {
    return '';
  }
}, {
  id: 'consumption',
  name: 'Last month'
}, {
  id: 'showMore',
  name: '',
  value: function value() {
    return ' ';
  }
}];

var allCommons = [{
  id: 'key',
  name: '',
  value: function value() {
    return '';
  }
}, {
  id: 'name',
  name: 'Name'
}, {
  id: 'size',
  name: 'Members'
}, {
  id: 'description',
  name: 'Description'
}, {
  id: 'createdOn',
  name: 'Created',
  value: function value(_value) {
    return React.createElement(FormattedDate, { value: _value });
  }
}, {
  id: 'member',
  name: 'Member',
  value: function value(_value2) {
    return _value2 ? React.createElement(
      'div',
      { style: { textAlign: 'left' } },
      React.createElement('i', { style: { marginRight: 20, marginTop: 0, marginBottom: 0 }, className: 'checkbox fa fa-check' })
    ) : React.createElement('i', null);
  }
}];

var members = [{
  id: 'key',
  name: '',
  value: function value() {
    return '';
  }
}, {
  id: 'ranking',
  name: 'Ranking'
}, {
  id: 'firstname',
  name: 'First name'
}, {
  id: 'lastname',
  name: 'Last name'
}, {
  id: 'joinedOn',
  name: 'Member since',
  value: function value(_value3) {
    return React.createElement(FormattedDate, { value: _value3 });
  }
},
/*
{
  id: 'consumption',
  name: 'Last month',
  //value: value => `${value} lt`,
},
*/
{
  id: 'selected',
  name: 'Chart',
  value: function value(_value4) {
    return _value4 ? React.createElement(
      'div',
      { style: { textAlign: 'left', fontSize: '0.9em' } },
      React.createElement('i', { style: { margin: 0 }, className: 'checkbox fa fa-check' })
    ) : React.createElement('i', null);
  }
}];

module.exports = {
  commons: commons,
  allCommons: allCommons,
  members: members
};