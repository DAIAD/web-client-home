'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/Notifications.js',
  components: _components,
  locals: [],
  imports: [_react3.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _livereactloadBabelTransform2(Component, id);
  };
}

var React = require('react');

var bs = require('react-bootstrap');
var classNames = require('classnames');

var _require = require('react-intl'),
    FormattedRelative = _require.FormattedRelative;

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES,
    BASE64 = _require2.BASE64;

var Topbar = require('../layout/Topbar');
var MainSection = require('../layout/MainSection');

var _require3 = require('../helpers/Widgets'),
    ChartWidget = _require3.ChartWidget;

var NotificationList = require('../helpers/NotificationList');

function NotificationMessage(props) {
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
        'a',
        { className: 'pull-left', onClick: function onClick() {
            return setActiveMessage(previousMessageId, notification.type);
          } },
        React.createElement('img', { alt: 'previous', src: IMAGES + '/arrow-big-left.svg' }),
        React.createElement(
          'span',
          null,
          'Previous'
        )
      ) : React.createElement('span', null),
      nextMessageId != null ? React.createElement(
        'a',
        { className: 'pull-right', onClick: function onClick() {
            return setActiveMessage(nextMessageId, notification.type);
          } },
        React.createElement(
          'span',
          null,
          'Next'
        ),
        React.createElement('img', { alt: 'next', src: IMAGES + '/arrow-big-right.svg' })
      ) : React.createElement('span', null)
    )
  );
}

var Notifications = _wrapComponent('_component')(React.createClass({
  displayName: 'Notifications',

  render: function render() {
    var _props = this.props,
        _t = _props._t,
        categories = _props.categories,
        notifications = _props.messages,
        activeMessageId = _props.activeMessageId,
        previousMessageId = _props.previousMessageId,
        nextMessageId = _props.nextMessageId,
        notification = _props.activeMessage,
        activeTab = _props.activeTab,
        setActiveMessage = _props.setActiveMessage,
        setActiveTab = _props.setActiveTab,
        widget = _props.widget,
        fetchMoreActive = _props.fetchMoreActive,
        totalInCategory = _props.totalInCategory,
        loading = _props.loading;

    return React.createElement(
      MainSection,
      { id: 'section.notifications' },
      React.createElement(
        'div',
        { className: 'notifications' },
        React.createElement(
          'div',
          { className: 'notifications-left' },
          React.createElement(
            Topbar,
            null,
            React.createElement(
              bs.Tabs,
              {
                position: 'top',
                tabWidth: 5,
                activeKey: activeTab,
                onSelect: function onSelect(key) {
                  return setActiveTab(key);
                }
              },
              categories.map(function (category) {
                var unreadReminder = category.unread && category.unread > 0 ? ' (' + category.unread + ')' : '';
                return React.createElement(bs.Tab, {
                  key: category.id,
                  eventKey: category.id,
                  title: _t(category.title) + unreadReminder
                });
              })
            )
          ),
          React.createElement(NotificationList, {
            notifications: notifications,
            onItemClick: setActiveMessage,
            hasMore: !loading && notifications.length < totalInCategory,
            loadMore: fetchMoreActive,
            activeId: activeMessageId
          })
        ),
        React.createElement(
          'div',
          { className: 'notifications-right' },
          React.createElement(NotificationMessage, {
            notification: notification,
            setActiveMessage: setActiveMessage,
            previousMessageId: previousMessageId,
            nextMessageId: nextMessageId,
            widget: widget
          })
        )
      )
    );
  }
}));

module.exports = Notifications;