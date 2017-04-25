'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var ReCAPTCHA = require('react-google-recaptcha');

var MainSection = require('../../layout/MainSection');
var LocaleSwitcher = require('../../LocaleSwitcher');

var _require2 = require('../../../utils/general'),
    uploadFile = _require2.uploadFile,
    validatePassword = _require2.validatePassword;

var _require3 = require('../../../constants/HomeConstants'),
    COUNTRIES = _require3.COUNTRIES,
    TIMEZONES = _require3.TIMEZONES,
    SYSTEM_UNITS = _require3.SYSTEM_UNITS,
    PNG_IMAGES = _require3.PNG_IMAGES,
    BASE64 = _require3.BASE64;

function ChangePassword(props) {
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
      dialogClassName: 'password-change-modal',
      bsSize: 'md'
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
          'Change Password'
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
          bs.Button,
          { style: { marginRight: 20 }, onClick: resetChangePassword },
          'Cancel'
        ),
        React.createElement(
          bs.Button,
          { type: 'submit' },
          'Update'
        )
      )
    )
  );
}

function ProfileForm(props) {
  var _t = props._t,
      profile = props.profileForm,
      locale = props.locale,
      errors = props.errors,
      actions = props.actions;
  var saveToProfile = actions.saveToProfile,
      updateProfileForm = actions.updateProfileForm,
      fetchProfile = actions.fetchProfile,
      _setLocale = actions.setLocale,
      setForm = actions.setForm,
      setError = actions.setError,
      dismissError = actions.dismissError,
      changePassword = actions.changePassword,
      setChangePassword = actions.setChangePassword;

  return React.createElement(
    'form',
    {
      id: 'form-profile',
      style: { width: 400 },
      onSubmit: function onSubmit(e) {
        e.preventDefault();
        saveToProfile(JSON.parse(JSON.stringify(profile))).then(function (p) {
          fetchProfile();
        });
      }
    },
    profile.photo ? React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        border: '2px #2D3580 solid'
      },
      src: '' + BASE64 + profile.photo,
      alt: 'profile'
    }) : React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        border: '2px #2D3580 solid'
      },
      src: PNG_IMAGES + '/daiad-consumer.png',
      alt: 'profile'
    }),
    React.createElement('input', {
      id: 'file-uploader',
      type: 'file',
      onChange: function onChange(e) {
        var file = e.target.files[0];
        uploadFile(file, function (value) {
          if (errors) {
            dismissError();
          }
          updateProfileForm({ photo: value });
        }, function (error) {
          setError(error);
        });
      }
    }),
    React.createElement('hr', null),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('profile.username'),
      defaultValue: profile.username,
      readOnly: true
    }),
    React.createElement(
      bs.Button,
      { onClick: setChangePassword },
      'Change password'
    ),
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('profile.firstname'),
      value: profile.firstname,
      onChange: function onChange(e) {
        return updateProfileForm({ firstname: e.target.value });
      }
    }),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('profile.lastname'),
      value: profile.lastname,
      onChange: function onChange(e) {
        return updateProfileForm({ lastname: e.target.value });
      }
    }),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('profile.address'),
      value: profile.address,
      onChange: function onChange(e) {
        return updateProfileForm({ address: e.target.value });
      }
    }),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('profile.zip'),
      value: profile.zip,
      onChange: function onChange(e) {
        return updateProfileForm({ zip: e.target.value });
      }
    }),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        {
          className: 'control-label col-md-3',
          style: { paddingLeft: 0 },
          htmlFor: 'country-switcher'
        },
        React.createElement(
          'span',
          null,
          React.createElement(FormattedMessage, { id: 'profile.country' })
        )
      ),
      React.createElement(
        bs.DropdownButton,
        {
          title: profile.country ? _t('countries.' + profile.country) : 'Select country',
          id: 'country-switcher',
          onSelect: function onSelect(e, val) {
            updateProfileForm({ country: val });
          }
        },
        COUNTRIES.map(function (country) {
          return React.createElement(
            bs.MenuItem,
            {
              key: country,
              eventKey: country,
              value: country
            },
            _t('countries.' + country)
          );
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        {
          className: 'control-label col-md-3',
          style: { paddingLeft: 0 },
          htmlFor: 'unit-switcher'
        },
        React.createElement(
          'span',
          null,
          React.createElement(FormattedMessage, { id: 'profile.unit.label' })
        )
      ),
      React.createElement(
        bs.DropdownButton,
        {
          id: 'unit-switcher',
          title: profile.unit != null ? _t('profile.unit.' + profile.unit.toLowerCase()) : _t('profile.unit.default'),
          value: profile.unit,
          onSelect: function onSelect(e, val) {
            updateProfileForm({ unit: val });
          }
        },
        SYSTEM_UNITS.map(function (mu) {
          return React.createElement(
            bs.MenuItem,
            {
              key: mu,
              eventKey: mu.toUpperCase(),
              value: mu
            },
            _t('profile.unit.' + mu)
          );
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        {
          className: 'control-label col-md-3',
          style: { paddingLeft: 0 },
          htmlFor: 'timezone-switcher'
        },
        React.createElement(
          'span',
          null,
          React.createElement(FormattedMessage, { id: 'profile.timezone' })
        )
      ),
      React.createElement(
        bs.DropdownButton,
        {
          title: profile.timezone ? _t('timezones.' + profile.timezone) : 'Select timezone',
          id: 'timezone-switcher',
          onSelect: function onSelect(e, val) {
            updateProfileForm({ timezone: val });
          }
        },
        TIMEZONES.map(function (timezone) {
          return React.createElement(
            bs.MenuItem,
            {
              key: timezone,
              eventKey: timezone,
              value: timezone
            },
            _t('timezones.' + timezone)
          );
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        {
          className: 'control-label col-md-3',
          style: { paddingLeft: 0 },
          htmlFor: 'locale-switcher'
        },
        React.createElement(
          'span',
          null,
          React.createElement(FormattedMessage, { id: 'profile.locale' })
        )
      ),
      React.createElement(LocaleSwitcher, {
        id: 'locale-switcher',
        _t: _t,
        setLocale: function setLocale(val) {
          _setLocale(val);
          updateProfileForm({ locale: val });
        },
        locale: locale
      })
    ),
    React.createElement('hr', null),
    React.createElement(
      'div',
      { className: 'pull-left' },
      React.createElement(bs.ButtonInput, {
        type: 'submit',
        value: _t('forms.submit')
      })
    ),
    React.createElement(ChangePassword, props)
  );
}

function Profile(props) {
  return React.createElement(
    MainSection,
    { id: 'section.profile' },
    React.createElement(
      'div',
      { style: { margin: 20 } },
      React.createElement(ProfileForm, props)
    )
  );
}

module.exports = Profile;