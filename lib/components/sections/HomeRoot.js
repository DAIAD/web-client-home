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

var _require2 = require('react-router'),
    Link = _require2.Link;

var Header = require('../layout/Header');
var Footer = require('../layout/Footer');

var _require3 = require('../../utils/general'),
    debounce = _require3.debounce,
    getActiveKey = _require3.getActiveKey;

var _require4 = require('../../constants/HomeConstants'),
    IMAGES = _require4.IMAGES,
    PNG_IMAGES = _require4.PNG_IMAGES,
    MAIN_MENU = _require4.MAIN_MENU;

function MainSidebar(props) {
  var menuItems = props.menuItems,
      _props$routes = props.routes,
      routes = _props$routes === undefined ? [] : _props$routes;

  var activeKey = getActiveKey(routes, 1);

  return React.createElement(
    'aside',
    { className: 'main-sidebar' },
    React.createElement(
      'ul',
      { className: 'main-menu-side' },
      menuItems.map(function (item) {
        return item.hidden ? React.createElement('div', { key: item.name }) : React.createElement(
          'li',
          {
            key: item.name,
            className: item.name === activeKey ? 'menu-item active' : 'menu-item'
          },
          React.createElement(
            Link,
            { to: item.route },
            item.image ? React.createElement(
              'div',
              { style: { float: 'left', minWidth: 25 } },
              React.createElement('img', { style: { width: 20 }, src: IMAGES + '/' + item.image, alt: item.name })
            ) : null,
            React.createElement(FormattedMessage, { id: item.title })
          )
        );
      })
    )
  );
}

function Loader() {
  return React.createElement(
    'div',
    null,
    React.createElement('img', {
      className: 'preloader',
      src: PNG_IMAGES + '/preloader-counterclock.png',
      alt: 'loading'
    }),
    React.createElement('img', {
      className: 'preloader-inner',
      src: PNG_IMAGES + '/preloader-clockwise.png',
      alt: 'loading'
    })
  );
}

function QuerySuccess() {
  return React.createElement(
    'div',
    { className: 'query-success' },
    React.createElement('i', {
      className: 'fa fa-check green '
    })
  );
}

var HomeRoot = _wrapComponent('_component')(React.createClass({
  displayName: 'HomeRoot',

  componentWillMount: function componentWillMount() {
    this.props.init();
  },
  componentDidMount: function componentDidMount() {
    this.viewportListener = debounce(this.setViewport, 100, { maxWait: 1000 });
    window.addEventListener('resize', this.viewportListener);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this.viewportListener);
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
      return React.createElement(Loader, null);
    }
    return React.createElement(
      IntlProvider,
      {
        locale: locale.locale,
        messages: locale.messages
      },
      React.createElement(
        'div',
        { className: 'site-container' },
        loading ? React.createElement(Loader, null) : React.createElement('div', null),
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
          user.isAuthenticated ? React.createElement(MainSidebar, { menuItems: MAIN_MENU, routes: routes }) : React.createElement(MainSidebar, { menuItems: [] }),
          children
        ),
        React.createElement(Footer, null)
      )
    );
  }
}));

module.exports = HomeRoot;