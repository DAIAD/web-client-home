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
  filename: 'components/helpers/NotificationsMenuItem.js',
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
var classNames = require('classnames');
var bs = require('react-bootstrap');

var NotificationsList = require('./NotificationsList');

var NotificationsMenuItem = _wrapComponent('_component')(React.createClass({
  displayName: 'NotificationsMenuItem',

  getInitialState: function getInitialState() {
    return {
      hover: false,
      popover: false
    };
  },
  render: function render() {
    var _this = this;

    var hasUnread = this.props.unreadNotifications > 0 ? 'hasUnread' : '';
    var unreadNotifications = hasUnread ? this.props.unreadNotifications : '';
    var _props = this.props,
        _t = _props._t,
        _props$link = _props.link,
        link = _props$link === undefined ? 'notifications' : _props$link;

    return React.createElement(
      'div',
      { className: 'notification-area' },
      React.createElement(
        'div',
        { className: 'notifications notification-item' },
        React.createElement(
          bs.OverlayTrigger,
          {
            id: 'notifications-trigger',
            trigger: 'click',
            title: _t('section.notifications'),
            placement: 'bottom',
            onEnter: function onEnter() {
              return _this.setState({ popover: true });
            },
            onExit: function onExit() {
              return _this.setState({ popover: false });
            },
            rootClose: true,
            ref: function ref(node) {
              _this.node = node;
            },
            overlay: React.createElement(
              bs.Popover,
              {
                id: 'notifications-popover',
                title: _t('section.notifications')
              },
              React.createElement(NotificationsList, {
                notifications: this.props.notifications,
                onItemClick: function onItemClick(id, type) {
                  _this.node.hide();
                  _this.props.linkToNotification({ notificationId: id, notificationType: type });
                },
                hasMore: !this.props.loading && this.props.notifications.length < this.props.totalNotifications,
                loadMore: this.props.fetchMoreAll
              }),
              React.createElement(
                'div',
                { className: 'footer' },
                React.createElement(
                  'button',
                  {
                    className: 'btn-a notifications-show-all',
                    onClick: function onClick() {
                      _this.node.hide();
                      _this.props.goTo(link);
                    }
                  },
                  _t('notifications.showAll')
                )
              )
            )
          },
          React.createElement(
            'button',
            {
              className: 'btn-a',
              onMouseEnter: function onMouseEnter() {
                return _this.setState({ hover: true });
              },
              onMouseLeave: function onMouseLeave() {
                return _this.setState({ hover: false });
              }
            },
            React.createElement(
              'span',
              { className: classNames(hasUnread, 'red') },
              unreadNotifications
            ),
            React.createElement('i', {
              className: classNames('fa', 'fa-md', 'navy', this.state.hover || this.state.popover ? 'fa-bell' : 'fa-bell-o')
            })
          )
        )
      )
    );
  }
}));

module.exports = NotificationsMenuItem;