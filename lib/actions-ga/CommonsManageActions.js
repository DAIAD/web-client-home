'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/CommonsManageActions');

var clickConfirmCommon = function clickConfirmCommon() {
  return function (dispatch, getState) {
    var _getState$forms$confi = getState().forms.confirm,
        mode = _getState$forms$confi.mode,
        common = _getState$forms$confi.item;


    if (mode === 'create') {
      ReactGA.event({
        category: 'commons',
        action: 'created',
        label: common.name
      });
    } else if (mode === 'update') {
      ReactGA.event({
        category: 'commons',
        action: 'updated'
      });
    } else if (mode === 'delete') {
      ReactGA.event({
        category: 'commons',
        action: 'deleted'
      });
    } else if (mode === 'leave') {
      ReactGA.event({
        category: 'commons',
        action: 'left'
      });
    } else if (mode === 'join') {
      ReactGA.event({
        category: 'commons',
        action: 'joined'
      });
    } else {
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    return dispatch(Actions.clickConfirmCommon());
  };
};

module.exports = _extends({}, Actions, {
  clickConfirmCommon: clickConfirmCommon
});