'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

var callAPI = function callAPI(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
  var csrf = data.csrf;


  var fetchObj = _extends({
    method: method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrf
    }
  }, method === 'POST' || method === 'PUT' ? { body: JSON.stringify(data) } : {});

  return fetch(url, fetchObj).then(function (response) {
    return response.json().then(function (json) {
      return _extends({}, json, { csrf: response.headers.get('X-CSRF-TOKEN') });
    }).catch(function (error) {
      console.error('Error parsing response:', error, url);
      throw error;
    });
  });
};

module.exports = callAPI;