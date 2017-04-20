'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/notifications/index.js',
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

var Topbar = require('../../layout/Topbar');
var MainSection = require('../../layout/MainSection');
var NotificationsList = require('../../helpers/NotificationsList');
var Notification = require('./Notification');

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
          React.createElement(NotificationsList, {
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
          React.createElement(Notification, {
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