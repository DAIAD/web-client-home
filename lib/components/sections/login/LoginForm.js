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
  filename: 'components/sections/login/LoginForm.js',
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
    FormattedMessage = _require.FormattedMessage;

var Login = _wrapComponent('_component')(React.createClass({
  displayName: 'Login',

  componentWillMount: function componentWillMount() {
    this.props.dismissError();
    this.props.dismissInfo();
    this.username = null;
    this.password = null;
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        _t = _props._t,
        errors = _props.errors,
        goToResetPassword = _props.goToResetPassword;

    return React.createElement(
      'form',
      {
        key: 'login',
        className: 'form-login',
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          _this.props.login(_this.username, _this.password);
        }
      },
      React.createElement(
        'h3',
        null,
        React.createElement(FormattedMessage, { id: 'section.login' })
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement('input', {
          id: 'username',
          name: 'username',
          type: 'text',
          onChange: function onChange(e) {
            _this.username = e.target.value;
          },
          placeholder: _t('loginForm.placeholder.username'),
          className: 'form-control'
        })
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement('input', {
          id: 'password',
          name: 'password',
          type: 'password',
          onChange: function onChange(e) {
            _this.password = e.target.value;
          },
          placeholder: _t('loginForm.placeholder.password'),
          className: 'form-control'
        })
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: 'btn btn-primary action-login'
        },
        React.createElement(FormattedMessage, { id: 'loginForm.button.signin' })
      ),
      React.createElement(
        'div',
        { className: 'link-reset' },
        React.createElement(
          'button',
          {
            className: 'btn-a',
            onClick: goToResetPassword
          },
          React.createElement(FormattedMessage, { id: 'loginForm.forgotPassword' })
        )
      )
    );
  }
}));

module.exports = Login;