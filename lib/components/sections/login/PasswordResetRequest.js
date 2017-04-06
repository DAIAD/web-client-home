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
  filename: 'components/sections/login/PasswordResetRequest.js',
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
    injectIntl = _require.injectIntl,
    FormattedMessage = _require.FormattedMessage;

var PasswordResetRequestForm = _wrapComponent('_component')(React.createClass({
  displayName: 'PasswordResetRequestForm',

  componentWillMount: function componentWillMount() {
    this.props.dismissError();
    this.props.dismissInfo();
    this.username = null;
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        _t = _props._t,
        goToLogin = _props.goToLogin,
        requestPasswordReset = _props.requestPasswordReset,
        username = _props.username;

    return React.createElement(
      'form',
      {
        key: 'login',
        className: 'form-login',
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          requestPasswordReset(_this.username);
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
          id: 'username',
          name: 'username',
          type: 'text',
          defaultValue: username,
          onChange: function onChange(e) {
            _this.username = e.target.value;
          },
          placeholder: _t('loginForm.placehoder.username'),
          className: 'form-control'
        })
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: 'btn btn-primary action-request-reset'
        },
        React.createElement(FormattedMessage, { id: 'loginForm.button.reset-request' })
      ),
      React.createElement(
        'div',
        { className: 'link-reset' },
        React.createElement(
          'a',
          { onClick: goToLogin },
          'Back'
        )
      )
    );
  }
}));

module.exports = PasswordResetRequestForm;