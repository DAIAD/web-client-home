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
  filename: 'components/LogoutForm.js',
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

var Logout = _wrapComponent('_component')(React.createClass({
  displayName: 'Logout',

  onLogout: function onLogout(e) {
    e.preventDefault();
    this.props.logout();
  },
  render: function render() {
    var _t = this.props._t;

    if (!this.props.isAuthenticated) {
      return React.createElement('div', null);
    }
    return React.createElement(
      'a',
      {
        id: 'logout',
        className: 'logout',
        title: _t('loginForm.button.signout'),
        onClick: this.onLogout,
        type: 'submit'
      },
      React.createElement('i', { className: classNames('fa', 'fa-md', 'fa-sign-out', 'navy') })
    );
  }
}));

module.exports = Logout;