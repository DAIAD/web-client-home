'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');
var classNames = require('classnames');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedRelative = _require.FormattedRelative;

var _require2 = require('../../helpers/Widgets'),
    ChartWidget = _require2.ChartWidget;

var _require3 = require('../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES,
    BASE64 = _require3.BASE64;

function Notification(props) {
  var notification = props.notification,
      nextMessageId = props.nextMessageId,
      previousMessageId = props.previousMessageId,
      setActiveMessage = props.setActiveMessage,
      widget = props.widget;

  return !notification ? React.createElement('div', null) : React.createElement(
    'div',
    { className: 'notification' },
    React.createElement(
      'h3',
      { className: 'notification-header' },
      notification.title
    ),
    notification.imageEncoded ? React.createElement('img', {
      className: 'notification-img',
      src: '' + BASE64 + notification.imageEncoded,
      alt: 'tip'
    }) : null,
    widget && widget.chartData ? React.createElement(ChartWidget, _extends({
      height: 300
    }, widget)) : null,
    React.createElement(
      'div',
      { className: 'notification-details' },
      React.createElement(
        'p',
        null,
        notification.description
      ),
      function () {
        return notification.acknowledgedOn ? React.createElement(
          'div',
          { className: 'acknowledged' },
          React.createElement('i', { className: classNames('fa', 'fa-md', 'green', 'fa-check') }),
          React.createElement(FormattedRelative, { value: notification.acknowledgedOn })
        ) : React.createElement('span', null);
      }()
    ),
    React.createElement(
      'div',
      { className: 'notification-pagination' },
      previousMessageId != null ? React.createElement(
        'button',
        {
          className: 'btn-a pull-left',
          onClick: function onClick() {
            return setActiveMessage(previousMessageId, notification.type);
          }
        },
        React.createElement('img', { alt: 'previous', src: IMAGES + '/arrow-big-left.svg' }),
        React.createElement(FormattedMessage, { id: 'forms.previous' })
      ) : React.createElement('span', null),
      nextMessageId != null ? React.createElement(
        'button',
        {
          className: 'btn-a pull-right',
          onClick: function onClick() {
            return setActiveMessage(nextMessageId, notification.type);
          }
        },
        React.createElement(FormattedMessage, { id: 'forms.next' }),
        React.createElement('img', { alt: 'next', src: IMAGES + '/arrow-big-right.svg' })
      ) : React.createElement('span', null)
    )
  );
}

module.exports = Notification;