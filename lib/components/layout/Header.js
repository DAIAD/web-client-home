'use strict';

var React = require('react');

var _require = require('react-router'),
    Link = _require.Link;

var _require2 = require('react-intl'),
    injectIntl = _require2.injectIntl,
    FormattedMessage = _require2.FormattedMessage;

var LocaleSwitcher = require('../helpers/LocaleSwitcher');
var Logout = require('../helpers/LogoutForm');
var ErrorDisplay = require('../helpers/ErrorDisplay');
var NotificationsMenuItem = require('../helpers/NotificationsMenuItem');
var UserMenuItem = require('../helpers/UserMenuItem');
var MainLogo = require('../helpers/MainLogo');

var _require3 = require('../../utils/general'),
    formatMessage = _require3.formatMessage;

var _require4 = require('../../constants/HomeConstants'),
    IMAGES = _require4.IMAGES,
    PNG_IMAGES = _require4.PNG_IMAGES,
    BASE64 = _require4.BASE64;

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
  return isAuthenticated ? React.createElement(
    'header',
    { className: 'site-header' },
    React.createElement(ErrorDisplay, {
      _t: _t,
      dismissError: dismissError,
      errors: errors,
      imgPrefix: IMAGES
    }),
    React.createElement(MainLogo, { imgPrefix: IMAGES }),
    React.createElement(
      'div',
      { className: 'top-header-right' },
      React.createElement(NotificationsMenuItem, {
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
      React.createElement(UserMenuItem, {
        _t: _t,
        photo: photo,
        firstname: firstname,
        imgPrefix: PNG_IMAGES,
        base64Prefix: BASE64
      }),
      React.createElement(Logout, {
        _t: _t,
        isAuthenticated: isAuthenticated,
        logout: logout,
        className: 'navbar logout'
      })
    )
  ) : React.createElement(
    'header',
    { className: 'site-header' },
    React.createElement(MainLogo, { imgPrefix: IMAGES }),
    React.createElement(
      'div',
      { className: 'top-header-right' },
      React.createElement(LocaleSwitcher, {
        _t: _t,
        setLocale: setLocale,
        locale: locale
      })
    )
  );
}

module.exports = injectIntl(Header);