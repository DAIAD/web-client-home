'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/MembersManageActions');

var addMember = function addMember(data) {
  ReactGA.event({
    category: 'profile',
    action: 'created member'
  });
  return Actions.addMember(data);
};

var editMember = function editMember(data) {
  ReactGA.event({
    category: 'profile',
    action: 'updated member'
  });
  return Actions.editMember(data);
};

var removeMember = function removeMember(data) {
  ReactGA.event({
    category: 'profile',
    action: 'deleted member'
  });
  return Actions.deleteMember(data);
};

var clickConfirmMember = function clickConfirmMember() {
  return function (dispatch, getState) {
    var _getState$forms$confi = getState().forms.confirm,
        item = _getState$forms$confi.item,
        mode = _getState$forms$confi.mode;


    if (mode === 'create') {
      ReactGA.event({
        category: 'profile',
        action: 'created member'
      });
    } else if (mode === 'update') {
      ReactGA.event({
        category: 'profile',
        action: 'updated member'
      });
    } else if (mode === 'delete') {
      ReactGA.event({
        category: 'profile',
        action: 'deleted member'
      });
    } else {
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    return dispatch(Actions.clickConfirmMember());
  };
};

module.exports = _extends({}, Actions, {
  clickConfirmMember: clickConfirmMember
});