'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var ReCAPTCHA = require('react-google-recaptcha');

var _require2 = require('../../../../utils/general'),
    validatePassword = _require2.validatePassword;

function ChangePasswordModal(props) {
  var _t = props._t,
      profile = props.profileForm,
      showChangePassword = props.showChangePassword,
      actions = props.actions;
  var setError = actions.setError,
      updateProfileForm = actions.updateProfileForm,
      changePassword = actions.changePassword,
      resetChangePassword = actions.resetChangePassword;
  var password = profile.password,
      confirmPassword = profile.confirmPassword,
      captcha = profile.captcha;

  return React.createElement(
    bs.Modal,
    {
      animation: false,
      backdrop: 'static',
      show: showChangePassword,
      onHide: resetChangePassword,
      dialogClassName: 'password-change-modal'
    },
    React.createElement(
      'form',
      {
        id: 'form-change-password',
        onSubmit: function onSubmit(e) {
          e.preventDefault();

          validatePassword(password, confirmPassword).then(function () {
            changePassword(password, captcha).then(resetChangePassword);
          }).catch(function (error) {
            setError(error);
          });
        }
      },
      React.createElement(
        bs.Modal.Header,
        { closeButton: true },
        React.createElement(
          bs.Modal.Title,
          null,
          React.createElement(FormattedMessage, { id: 'profile.changePassword' })
        )
      ),
      React.createElement(
        bs.Modal.Body,
        null,
        React.createElement(
          'div',
          null,
          React.createElement(bs.Input, {
            id: 'password',
            type: 'password',
            label: _t('loginForm.placeholder.password'),
            value: profile.password,
            onChange: function onChange(e) {
              return updateProfileForm({ password: e.target.value });
            }
          }),
          React.createElement(bs.Input, {
            id: 'password-confirm',
            type: 'password',
            label: _t('loginForm.placeholder.password-confirm'),
            value: profile.confirmPassword,
            onChange: function onChange(e) {
              return updateProfileForm({ confirmPassword: e.target.value });
            }
          }),
          React.createElement(
            'div',
            { className: 'form-group form-captcha' },
            React.createElement(ReCAPTCHA, {
              sitekey: properties.captchaKey,
              theme: 'light',
              onChange: function onChange(value) {
                return updateProfileForm({ captcha: value });
              }
            })
          )
        )
      ),
      React.createElement(
        bs.Modal.Footer,
        null,
        React.createElement(
          'button',
          {
            className: 'btn-a',
            style: { marginRight: 20 },
            onClick: resetChangePassword
          },
          React.createElement(FormattedMessage, { id: 'forms.cancel' })
        ),
        React.createElement(
          'button',
          {
            className: 'btn-a',
            type: 'submit'
          },
          React.createElement(FormattedMessage, { id: 'forms.update' })
        )
      )
    )
  );
}

module.exports = ChangePasswordModal;