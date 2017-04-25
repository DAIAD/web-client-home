'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var Select = require('react-select');

var _require2 = require('../../../../utils/general'),
    uploadFile = _require2.uploadFile;

var _require3 = require('../../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES,
    BASE64 = _require3.BASE64;

function CommonForm(props) {
  var _t = props._t,
      values = props.values,
      _onChange = props.onChange,
      disabled = props.disabled,
      errors = props.errors;

  return React.createElement(
    'div',
    { className: 'commons-form-fields' },
    values.image ? React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        border: '2px #2D3580 solid'
      },
      src: '' + BASE64 + values.image,
      alt: 'commons'
    }) : React.createElement('img', {
      style: {
        marginTop: -5,
        marginBottom: 20,
        height: 100,
        width: 100,
        background: '#2D3580',
        border: '2px #2D3580 solid'
      },
      src: IMAGES + '/commons-menu.svg',
      alt: 'commons-default'
    }),
    !disabled ? React.createElement('input', {
      id: 'file-uploader',
      type: 'file',
      onChange: function onChange(e) {
        var file = e.target.files[0];
        uploadFile(file, function (value) {
          //if (errors) { dismissError(); }
          _onChange({ image: value });
        }, function (error) {
          console.error('error uploading', error);
          //setError(error);
        });
      }
    }) : React.createElement('div', null),
    React.createElement('hr', null),
    React.createElement(bs.Input, {
      type: 'text',
      placeholder: _t('commonsManage.placeholder-name'),
      label: _t('commonsManage.name'),
      disabled: disabled,
      onChange: function onChange(e) {
        _onChange({ name: e.target.value });
      },
      value: values.name
    }),
    React.createElement(bs.Input, {
      type: 'textarea',
      placeholder: _t('commonsManage.placeholder-description'),
      label: _t('commonsManage.description'),
      disabled: disabled,
      onChange: function onChange(e) {
        _onChange({ description: e.target.value });
      },
      value: values.description
    })
  );
}

module.exports = CommonForm;