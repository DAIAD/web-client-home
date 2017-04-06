'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

var formAPI = function formAPI(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
  var formData = data.formData,
      csrf = data.csrf;


  var fetchObj = {
    method: method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrf
    },
    body: formData
  };

  return fetch(url, fetchObj).then(function (response) {
    return response.json().then(function (json) {
      return _extends({}, json, { csrf: response.headers.get('X-CSRF-TOKEN') });
    });
  }).catch(function (error) {
    throw new Error('response parsing failed', error);
  });
};

module.exports = formAPI;