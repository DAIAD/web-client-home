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
  filename: 'components/sections/login/PasswordReset.js',
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

var ReCAPTCHA = require('react-google-recaptcha');

var _require2 = require('../../../utils/general'),
    validatePassword = _require2.validatePassword;

var PasswordResetForm = _wrapComponent('_component')(React.createClass({
  displayName: 'PasswordResetForm',

  componentWillMount: function componentWillMount() {
    this.props.dismissError();
    this.props.dismissInfo();
    this.password = null;
    this.confirmPassword = null;
    this.captcha = null;
    this.token = this.props.params.token;
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        _t = _props._t,
        goToLogin = _props.goToLogin,
        params = _props.params,
        setError = _props.setError;

    return React.createElement(
      'form',
      {
        key: 'reset',
        className: 'form-login',
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          validatePassword(_this.password, _this.confirmPassword).then(function () {
            _this.props.resetPassword(_this.password, _this.token, _this.captcha).then(goToLogin);
          }).catch(function (error) {
            setError(error);
          });
        }
      },
      React.createElement(
        'h3',
        null,
        React.createElement(FormattedMessage, { id: 'section.reset' })
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
        'div',
        { className: 'form-group' },
        React.createElement('input', {
          id: 'password-confirm',
          name: 'password-confirm',
          type: 'password',
          onChange: function onChange(e) {
            _this.confirmPassword = e.target.value;
          },
          placeholder: _t('loginForm.placeholder.password-confirm'),
          className: 'form-control'
        })
      ),
      React.createElement(
        'div',
        { className: 'form-group form-captcha' },
        React.createElement(ReCAPTCHA, {
          sitekey: properties.captchaKey,
          theme: 'light',
          onChange: function onChange(value) {
            _this.captcha = value;
          }
        })
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: 'btn btn-primary action-reset'
        },
        React.createElement(FormattedMessage, { id: 'loginForm.button.reset-submit' })
      ),
      React.createElement(
        'div',
        { className: 'link-reset' },
        React.createElement(
          'button',
          {
            className: 'btn-a',
            onClick: goToLogin
          },
          React.createElement(FormattedMessage, { id: 'forms.back' })
        )
      )
    );
  }
}));

module.exports = PasswordResetForm;