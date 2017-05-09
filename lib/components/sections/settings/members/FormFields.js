'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var Dropdown = require('../../../helpers/Dropdown');

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
    { className: 'member-form-fields' },
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
    member.index !== 0 ? React.createElement('input', {
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
    }) : React.createElement('span', null),
    React.createElement('hr', null),
    React.createElement(bs.Input, {
      type: 'text',
      label: _t('member.name'),
      placeholder: _t('member.placeholder-name'),
      readOnly: member.index === 0,
      onChange: function onChange(e) {
        updateMemberForm({ name: e.target.value });
      },
      value: member.name
    }),
    React.createElement(bs.Input, {
      type: 'number',
      min: '0',
      placeholder: _t('member.placeholder-age'),
      label: _t('member.age'),
      onChange: function onChange(e) {
        updateMemberForm({ age: parseInt(e.target.value, 0) });
      },
      value: member.age
    }),
    React.createElement(Dropdown, {
      _t: _t,
      id: 'member-gender-' + member.index,
      label: 'member.gender',
      defaultValue: 'FEMALE',
      titlePrefix: 'member',
      value: member.gender,
      update: function update(val) {
        return updateMemberForm({ gender: val });
      },
      options: ['FEMALE', 'MALE']
    })
  );
}

module.exports = MemberFormFields;