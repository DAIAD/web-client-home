'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedTime = _require.FormattedTime,
    FormattedDate = _require.FormattedDate;

var DisplayMetric = require('../../helpers/DisplayMetric');

var DatetimeInput = require('react-datetime');

var ShowerMember = require('./ShowerMember');
var InPictures = require('./InPictures');

var _require2 = require('../../../utils/general'),
    volumeToPictures = _require2.volumeToPictures,
    energyToPictures = _require2.energyToPictures;

var _require3 = require('../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES;

function SessionDetailsLine(props) {
  var id = props.id,
      name = props.name,
      title = props.title,
      icon = props.icon,
      data = props.data,
      _t = props._t;

  return data == null && id !== 'volume' ? React.createElement('div', null) : React.createElement(
    'li',
    { className: 'session-item' },
    React.createElement(
      'span',
      null,
      React.createElement(
        'h4',
        { style: { float: 'left' } },
        React.createElement('img', {
          style: {
            height: id === 'temperature' ? 30 : 24,
            marginLeft: id === 'temperature' ? 7 : 0,
            marginRight: 20
          },
          src: IMAGES + '/' + icon,
          alt: name
        }),
        React.createElement(FormattedMessage, { id: title })
      ),
      function () {
        if (id === 'volume') {
          return React.createElement(InPictures, _extends({}, volumeToPictures(data && data[0]), { metric: id, _t: _t }));
        } else if (id === 'energy') {
          return React.createElement(InPictures, _extends({}, energyToPictures(data && data[0]), { metric: id, _t: _t }));
        }
        return React.createElement('span', null);
      }(),
      React.createElement(
        'h4',
        { style: { float: 'right' } },
        React.createElement(DisplayMetric, { value: data })
      )
    )
  );
}

function SessionDetails(props) {
  var _t = props._t,
      data = props.data,
      activeDeviceType = props.activeDeviceType,
      members = props.members,
      editShower = props.editShower,
      setSessionFilter = props.setSessionFilter,
      assignToMember = props.assignToMember,
      enableEditShower = props.enableEditShower,
      disableEditShower = props.disableEditShower,
      ignoreShower = props.ignoreShower,
      memberFilter = props.memberFilter,
      fetchAndSetQuery = props.fetchAndSetQuery,
      nextReal = props.nextReal,
      setShowerReal = props.setShowerReal,
      setShowerTimeForm = props.setShowerTimeForm,
      showerTime = props.showerTime,
      metrics = props.metrics;
  var deviceKey = data.device,
      sessionId = data.id,
      member = data.member,
      history = data.history;


  return !data ? React.createElement('div', null) : React.createElement(
    'div',
    { className: 'shower-info' },
    activeDeviceType === 'AMPHIRO' && editShower ? React.createElement(
      'div',
      { className: 'ignore-shower' },
      React.createElement(
        'button',
        {
          className: 'btn-a',
          onClick: function onClick() {
            return ignoreShower({
              deviceKey: deviceKey,
              sessionId: sessionId
            }).then(function () {
              return fetchAndSetQuery({ active: [deviceKey, sessionId] });
            }).then(function () {
              return disableEditShower();
            });
          }
        },
        React.createElement(FormattedMessage, { id: 'history.shower-delete' })
      )
    ) : React.createElement('span', null),
    React.createElement(
      'div',
      { className: 'headline' },
      activeDeviceType === 'AMPHIRO' ? React.createElement(
        'div',
        { className: 'headline-date' },
        React.createElement('i', { className: 'fa fa-calendar' }),
        editShower && history ? React.createElement(
          'div',
          { className: 'headline-date-wrapper' },
          React.createElement(DatetimeInput, {
            dateFormat: 'DD/MM/YYYY',
            timeFormat: 'HH:mm',
            className: 'headline-date-input',
            inputProps: { size: 18 },
            value: showerTime,
            isValidDate: function isValidDate(curr) {
              return nextReal ? curr.valueOf() <= nextReal.timestamp : curr.valueOf() <= new Date().valueOf();
            },
            isValidTime: function isValidTime(curr) {
              return nextReal ? curr.valueOf() <= nextReal.timestamp : curr.valueOf() <= new Date().valueOf();
            },
            onChange: function onChange(val) {
              setShowerTimeForm(val.valueOf());
            }
          }),
          '\xA0',
          React.createElement(
            'button',
            {
              className: 'btn-a',
              onClick: function onClick() {
                return setShowerReal({
                  deviceKey: deviceKey,
                  sessionId: sessionId,
                  timestamp: showerTime
                }).then(function () {
                  return fetchAndSetQuery({ active: [deviceKey, sessionId] });
                }).then(function () {
                  return disableEditShower();
                });
              }
            },
            React.createElement(FormattedMessage, { id: 'forms.set' })
          )
        ) : React.createElement(
          'span',
          null,
          React.createElement(FormattedDate, {
            value: new Date(data.timestamp),
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }),
          '\xA0',
          React.createElement(FormattedTime, { value: new Date(data.timestamp) })
        )
      ) : React.createElement(
        'span',
        { className: 'headline-date' },
        React.createElement('i', { className: 'fa fa-calendar' }),
        data.date
      ),
      activeDeviceType === 'AMPHIRO' ? React.createElement(
        'div',
        { className: 'edit-shower-control' },
        editShower ? React.createElement(
          'button',
          {
            className: 'btn-a',
            onClick: disableEditShower
          },
          React.createElement('i', { className: 'fa fa-times' })
        ) : React.createElement(
          'button',
          {
            className: 'btn-a',
            onClick: enableEditShower
          },
          React.createElement('i', { className: 'fa fa-pencil' })
        )
      ) : React.createElement('span', null),
      activeDeviceType === 'AMPHIRO' ? React.createElement(ShowerMember, {
        deviceKey: deviceKey,
        sessionId: sessionId,
        member: member,
        memberFilter: memberFilter,
        members: members,
        assignToMember: assignToMember,
        editShower: editShower,
        enableEditShower: enableEditShower,
        disableEditShower: disableEditShower,
        fetchAndSetQuery: fetchAndSetQuery
      }) : React.createElement('span', null)
    ),
    React.createElement(
      'ul',
      { className: 'sessions-list' },
      metrics.map(function (metric) {
        return React.createElement(SessionDetailsLine, {
          key: metric.id,
          _t: _t,
          icon: metric.icon,
          title: metric.title,
          id: metric.id,
          data: data[metric.id],
          details: metric.details
        });
      })
    )
  );
}

module.exports = SessionDetails;