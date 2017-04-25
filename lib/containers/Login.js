'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-router-redux'),
    push = _require3.push;

var _require4 = require('react-intl'),
    injectIntl = _require4.injectIntl;

var _require5 = require('../actions/UserActions'),
    login = _require5.login,
    requestPasswordReset = _require5.requestPasswordReset,
    resetPassword = _require5.resetPassword;

var _require6 = require('../actions/QueryActions'),
    dismissError = _require6.dismissError,
    setError = _require6.setError,
    setInfo = _require6.setInfo,
    dismissInfo = _require6.dismissInfo;

var _require7 = require('../utils/general'),
    formatMessage = _require7.formatMessage;

var Login = require('../components/sections/login/');

function mapStateToProps(state) {
  return {
    errors: state.query.errors,
    info: state.query.info
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login: login,
    dismissError: dismissError,
    setError: setError,
    dismissInfo: dismissInfo,
    setInfo: setInfo,
    requestPasswordReset: requestPasswordReset,
    resetPassword: resetPassword,
    goToResetPassword: function goToResetPassword() {
      return push('/password/reset/');
    },
    goToLogin: function goToLogin() {
      return push('/login/');
    }
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, stateProps, dispatchProps, ownProps, {
    _t: formatMessage(ownProps.intl)
  });
}

var LoginData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Login));
module.exports = LoginData;