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
  filename: 'components/sections/settings/profile/index.js',
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
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var MainSection = require('../../../layout/MainSection');
var LocaleSwitcher = require('../../../helpers/LocaleSwitcher');
var Dropdown = require('../../../helpers/Dropdown');
var ChangePasswordModal = require('./ChangePasswordModal');

var _require2 = require('../../../../utils/general'),
    uploadFile = _require2.uploadFile,
    validatePassword = _require2.validatePassword,
    filterObj = _require2.filterObj;

var _require3 = require('../../../../constants/HomeConstants'),
    COUNTRIES = _require3.COUNTRIES,
    TIMEZONES = _require3.TIMEZONES,
    SYSTEM_UNITS = _require3.SYSTEM_UNITS,
    PNG_IMAGES = _require3.PNG_IMAGES,
    BASE64 = _require3.BASE64;

var ProfileForm = _wrapComponent('_component')(React.createClass({
  displayName: 'ProfileForm',

  componentWillMount: function componentWillMount() {
    var profileForm = filterObj(this.props.profile, ['firstname', 'lastname', 'photo', 'email', 'username', 'locale', 'address', 'zip', 'country', 'timezone', 'unit']);

    this.props.actions.updateProfileForm(profileForm);
  },
  render: function render() {
    var _props = this.props,
        _t = _props._t,
        profile = _props.profileForm,
        locale = _props.locale,
        errors = _props.errors,
        actions = _props.actions;
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
          saveToProfile();
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
        value: profile.username,
        readOnly: true
      }),
      React.createElement(
        bs.Button,
        { onClick: setChangePassword },
        React.createElement(FormattedMessage, { id: 'profile.changePassword' })
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
      React.createElement(Dropdown, {
        _t: _t,
        id: 'country',
        label: 'profile.country',
        defaultValue: 'Spain',
        titlePrefix: 'countries',
        value: profile.country,
        update: function update(val) {
          return updateProfileForm({ country: val });
        },
        options: COUNTRIES
      }),
      React.createElement(Dropdown, {
        _t: _t,
        id: 'unit',
        label: 'profile.unit.label',
        defaultValue: 'METRIC',
        titlePrefix: 'profile.unit',
        value: profile.unit,
        update: function update(val) {
          return updateProfileForm({ unit: val });
        },
        options: SYSTEM_UNITS
      }),
      React.createElement(Dropdown, {
        _t: _t,
        id: 'timezone',
        label: 'profile.timezone',
        defaultValue: TIMEZONES[0],
        titlePrefix: 'timezones',
        value: profile.timezone,
        update: function update(val) {
          return updateProfileForm({ timezone: val });
        },
        options: TIMEZONES
      }),
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
          value: _t('forms.update')
        })
      ),
      React.createElement(ChangePasswordModal, this.props)
    );
  }
}));

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