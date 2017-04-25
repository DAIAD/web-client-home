'use strict';

var React = require('react');
var bs = require('react-bootstrap');

function ShowerMember(props) {
  var deviceKey = props.deviceKey,
      sessionId = props.sessionId,
      member = props.member,
      memberFilter = props.memberFilter,
      members = props.members,
      assignToMember = props.assignToMember,
      editShower = props.editShower,
      disableEditShower = props.disableEditShower,
      fetchAndSetQuery = props.fetchAndSetQuery;

  return React.createElement(
    'div',
    { className: 'headline-user' },
    React.createElement('i', { className: 'fa fa-user' }),
    editShower ? React.createElement(
      'div',
      { style: { float: 'right' } },
      React.createElement(
        bs.DropdownButton,
        {
          title: member,
          id: 'shower-user-switcher',
          onSelect: function onSelect(e, val) {
            assignToMember({
              deviceKey: deviceKey,
              sessionId: sessionId,
              memberIndex: val
            }).then(function () {
              return fetchAndSetQuery({ active: memberFilter === 'all' ? [deviceKey, sessionId] : null });
            }).then(function () {
              return disableEditShower();
            });
          }
        },
        members.map(function (m) {
          return React.createElement(
            bs.MenuItem,
            {
              key: m.id,
              eventKey: m.index,
              value: m.index
            },
            m.name
          );
        })
      )
    ) : React.createElement(
      'div',
      { style: { float: 'right' } },
      React.createElement(
        'span',
        { style: { margin: '0 15px' } },
        member
      )
    )
  );
}

module.exports = ShowerMember;