const ReactGA = require('react-ga');

const Actions = require('../actions/MembersManageActions');

const addMember = function (data) {
  ReactGA.event({
    category: 'profile',
    action: 'created member',
  });
  return Actions.addMember(data);
};

const editMember = function (data) {
  ReactGA.event({
    category: 'profile',
    action: 'updated member',
  });
  return Actions.editMember(data);
};

const removeMember = function (data) {
  ReactGA.event({
    category: 'profile',
    action: 'deleted member',
  });
  return Actions.deleteMember(data);
};

const clickConfirmMember = function () {
  return function (dispatch, getState) {
    const { item, mode } = getState().forms.confirm;

    if (mode === 'create') {
      ReactGA.event({
        category: 'profile',
        action: 'created member',
      });
    } else if (mode === 'update') {
      ReactGA.event({
        category: 'profile',
        action: 'updated member',
      });
    } else if (mode === 'delete') {
      ReactGA.event({
        category: 'profile',
        action: 'deleted member',
      });
    } else { 
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    return dispatch(Actions.clickConfirmMember());
  };
};

module.exports = {
  ...Actions,
  clickConfirmMember,
};
