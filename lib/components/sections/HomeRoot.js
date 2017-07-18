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
  filename: 'components/sections/HomeRoot.js',
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

var _require = require('react-intl'),
    IntlProvider = _require.IntlProvider,
    FormattedMessage = _require.FormattedMessage;

var Header = require('../layout/Header');
var Footer = require('../layout/Footer');
var MainSidebar = require('../layout/MainSidebar');
var Loader = require('../helpers/Loader');
var QuerySuccess = require('../helpers/QuerySuccess');

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES,
    PNG_IMAGES = _require2.PNG_IMAGES,
    MAIN_MENU = _require2.MAIN_MENU;

var HomeRoot = _wrapComponent('_component')(React.createClass({
  displayName: 'HomeRoot',

  componentWillMount: function componentWillMount() {
    this.props.init();
  },
  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', this.setViewport);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this.setViewport);
  },
  setViewport: function setViewport() {
    this.props.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
  },
  render: function render() {
    var _props = this.props,
        ready = _props.ready,
        locale = _props.locale,
        loading = _props.loading,
        user = _props.user,
        deviceCount = _props.deviceCount,
        messages = _props.messages,
        success = _props.success,
        unreadNotifications = _props.unreadNotifications,
        linkToNotification = _props.linkToNotification,
        totalNotifications = _props.totalNotifications,
        fetchMoreAll = _props.fetchMoreAll,
        logout = _props.logout,
        setLocale = _props.setLocale,
        errors = _props.errors,
        dismissError = _props.dismissError,
        children = _props.children,
        routes = _props.routes,
        goTo = _props.goTo;

    if (!ready) {
      return React.createElement(Loader, { imgPrefix: PNG_IMAGES });
    }
    return React.createElement(
      IntlProvider,
      {
        locale: locale.locale,
        messages: locale.messages
      },
      React.createElement(
        'div',
        { className: 'site-container', lang: locale.locale },
        loading ? React.createElement(Loader, { imgPrefix: PNG_IMAGES }) : React.createElement('div', null),
        success ? React.createElement(QuerySuccess, null) : React.createElement('div', null),
        React.createElement(Header, {
          firstname: user.profile.firstname,
          photo: user.profile.photo,
          deviceCount: deviceCount,
          isAuthenticated: user.isAuthenticated,
          notifications: messages,
          totalNotifications: totalNotifications,
          unreadNotifications: unreadNotifications,
          loading: loading,
          linkToNotification: linkToNotification,
          fetchMoreAll: fetchMoreAll,
          locale: locale.locale,
          logout: logout,
          setLocale: setLocale,
          errors: errors,
          dismissError: dismissError,
          goTo: goTo
        }),
        React.createElement(
          'div',
          { className: 'main-container' },
          user.isAuthenticated ? React.createElement(MainSidebar, { menuItems: MAIN_MENU, routes: routes, imgPrefix: IMAGES }) : React.createElement(MainSidebar, { menuItems: [] }),
          children
        ),
        React.createElement(Footer, null)
      )
    );
  }
}));

module.exports = HomeRoot;