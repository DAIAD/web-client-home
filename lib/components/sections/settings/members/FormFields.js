'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('../../../../utils/general'),
    uploadFile = _require2.uploadFile;

var _require3 = require('../../../../constants/HomeConstants'),
    PNG_IMAGES = _require3.PNG_IMAGES,
    BASE64 = _require3.BASE64;

function MemberFormFields(props) {
  var _t = props._t,
      errors = props.errors,
      member = props.member,
      fetchProfile = props.fetchProfile,
      updateMemberForm = props.updateMemberForm,
      setError = props.setError,
      dismissError = props.dismissError,
      goTo = props.goTo;

  return React.createElement(
    'div',
    null,
    member.photo ? React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        border: '2px #2D3580 solid'
      },
      src: '' + BASE64 + member.photo,
      alt: 'member'
    }) : React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        border: '2px #2D3580 solid'
      },
      src: PNG_IMAGES + '/daiad-consumer.png',
      alt: 'member'
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
          updateMemberForm({ photo: value });
        }, function (error) {
          setError(error);
        });
      }
    }),
    React.createElement('hr', null),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('member.name'),
      placeholder: 'Member name',
      onChange: function onChange(e) {
        updateMemberForm({ name: e.target.value });
      },
      value: member.name
    }),
    React.createElement(bs.Input, {
      type: 'number',
      min: '0',
      placeholder: 'Member age',
      label: _t('member.age'),
      onChange: function onChange(e) {
        updateMemberForm({ age: parseInt(e.target.value, 0) });
      },
      value: member.age
    }),
    React.createElement(
      'div',
      { className: 'form-group' },
      React.createElement(
        'label',
        {
          className: 'control-label col-md-3',
          style: { paddingLeft: 0 },
          htmlFor: 'gender-switcher'
        },
        React.createElement(
          'span',
          null,
          React.createElement(FormattedMessage, { id: 'member.gender' })
        )
      ),
      React.createElement(
        bs.DropdownButton,
        {
          title: member.gender ? _t('member.' + member.gender) : 'Select gender',
          id: 'gender-switcher',
          onSelect: function onSelect(e, val) {
            updateMemberForm({ gender: val });
          }
        },
        ['MALE', 'FEMALE'].map(function (gender) {
          return React.createElement(
            bs.MenuItem,
            {
              key: gender,
              eventKey: gender,
              value: gender
            },
            _t('member.' + gender)
          );
        })
      )
    )
  );
}

module.exports = MemberFormFields;