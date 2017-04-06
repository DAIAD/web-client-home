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
  filename: 'components/layout/Header.js',
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

var _require = require('react-router'),
    Link = _require.Link;

var _require2 = require('react-intl'),
    injectIntl = _require2.injectIntl,
    FormattedMessage = _require2.FormattedMessage;

var LocaleSwitcher = require('../LocaleSwitcher');
var Logout = require('../LogoutForm');
var NotificationList = require('../helpers/NotificationList');

var _require3 = require('../../utils/general'),
    formatMessage = _require3.formatMessage;

var _require4 = require('../../constants/HomeConstants'),
    IMAGES = _require4.IMAGES,
    PNG_IMAGES = _require4.PNG_IMAGES,
    BASE64 = _require4.BASE64;

/* DAIAD Logo */


function MainLogo() {
  return React.createElement(
    Link,
    { to: '/', className: 'logo', activeClassName: 'selected' },
    React.createElement('img', {
      src: IMAGES + '/daiad-logo-navy.svg',
      alt: 'DAIAD Logo',
      title: 'DAIAD'
    })
  );
}

/* User options */

function UserInfo(props) {
  var _t = props._t;

  return React.createElement(
    'div',
    { className: 'user-menu' },
    React.createElement(
      'div',
      { title: _t({ id: 'section.profile' }) },
      React.createElement(
        Link,
        { to: 'settings/profile' },
        React.createElement(
          'span',
          null,
          React.createElement(
            'b',
            null,
            props.firstname
          )
        ),
        props.photo ? React.createElement('img', {
          className: 'profile-header-photo',
          src: '' + BASE64 + props.photo,
          alt: 'profile'
        }) : React.createElement('img', {
          className: 'profile-header-photo',
          src: PNG_IMAGES + '/daiad-consumer.png',
          alt: 'profile'
        })
      )
    )
  );
}

var NotificationMenuItem = _wrapComponent('_component')(React.createClass({
  displayName: 'NotificationMenuItem',

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
    var _t = this.props._t;

    return React.createElement(
      bs.OverlayTrigger,
      {
        id: 'notifications-trigger',
        trigger: 'click',
        title: _t(this.props.item.title),
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
            title: _t(this.props.item.title)
          },
          React.createElement(NotificationList, {
            notifications: this.props.notifications,
            onItemClick: function onItemClick(id, type) {
              _this.node.hide();
              _this.props.linkToNotification(id, type);
            },
            hasMore: !this.props.loading && this.props.notifications.length < this.props.totalNotifications,
            loadMore: this.props.fetchMoreAll
          }),
          React.createElement(
            'div',
            { className: 'footer' },
            React.createElement(
              'a',
              {
                className: 'notifications-show-all',
                onClick: function onClick() {
                  _this.node.hide();
                  _this.props.goTo('notifications');
                }
              },
              _t('notifications.showAll')
            )
          )
        )
      },
      React.createElement(
        'a',
        {
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
    );
  }
}));

function NotificationArea(props) {
  return React.createElement(
    'div',
    { className: 'notification-area' },
    React.createElement(
      'div',
      { className: 'notifications notification-item' },
      React.createElement(NotificationMenuItem, _extends({}, props, {
        item: {
          name: 'notifications',
          title: 'section.notifications',
          image: 'images/svg/info.svg',
          link: '#'
        }
      }))
    )
  );
}

function ErrorDisplay(props) {
  var _t = props._t,
      errors = props.errors,
      dismissError = props.dismissError;

  return errors ? React.createElement(
    'div',
    { className: 'error-display' },
    React.createElement(
      'a',
      { onClick: function onClick() {
          return dismissError();
        }, className: 'error-display-x' },
      'x'
    ),
    React.createElement('img', { src: IMAGES + '/alert.svg', alt: 'error' }),
    React.createElement(
      'span',
      { className: 'widget-error' },
      React.createElement(FormattedMessage, { id: 'errors.' + errors })
    )
  ) : React.createElement('div', null);
}

function Header(props) {
  var intl = props.intl,
      firstname = props.firstname,
      photo = props.photo,
      isAuthenticated = props.isAuthenticated,
      notifications = props.notifications,
      linkToNotification = props.linkToNotification,
      unreadNotifications = props.unreadNotifications,
      totalNotifications = props.totalNotifications,
      logout = props.logout,
      deviceCount = props.deviceCount,
      setLocale = props.setLocale,
      locale = props.locale,
      errors = props.errors,
      dismissError = props.dismissError,
      fetchMoreAll = props.fetchMoreAll,
      loading = props.loading,
      goTo = props.goTo;


  var _t = formatMessage(intl);
  return React.createElement(
    'header',
    { className: 'site-header' },
    isAuthenticated ? React.createElement(
      'div',
      null,
      React.createElement(ErrorDisplay, {
        _t: _t,
        dismissError: dismissError,
        errors: errors
      }),
      React.createElement(MainLogo, null),
      React.createElement(
        'div',
        { className: 'top-header-right' },
        React.createElement(NotificationArea, {
          _t: _t,
          deviceCount: deviceCount,
          notifications: notifications,
          unreadNotifications: unreadNotifications,
          totalNotifications: totalNotifications,
          loading: loading,
          fetchMoreAll: fetchMoreAll,
          linkToNotification: linkToNotification,
          goTo: goTo
        }),
        React.createElement(UserInfo, {
          _t: _t,
          photo: photo,
          firstname: firstname
        }),
        React.createElement(Logout, {
          _t: _t,
          isAuthenticated: isAuthenticated,
          logout: logout,
          className: 'navbar logout'
        })
      )
    ) : React.createElement(
      'div',
      null,
      React.createElement(MainLogo, null),
      React.createElement(
        'div',
        { className: 'top-header-right' },
        React.createElement(LocaleSwitcher, {
          _t: _t,
          setLocale: setLocale,
          locale: locale
        })
      )
    )
  );
}

module.exports = injectIntl(Header);