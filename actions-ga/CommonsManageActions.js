const ReactGA = require('react-ga');

const Actions = require('../actions/CommonsManageActions');

const clickConfirmCommon = function () {
  return function (dispatch, getState) {
    const { mode, item: common } = getState().forms.confirm;

    if (mode === 'create') {
      ReactGA.event({
        category: 'commons',
        action: 'created',
        label: common.name,
      });
    } else if (mode === 'update') {
      ReactGA.event({
        category: 'commons',
        action: 'updated',
      });
    } else if (mode === 'delete') {
      ReactGA.event({
        category: 'commons',
        action: 'deleted',
      });
    } else if (mode === 'leave') {
      ReactGA.event({
        category: 'commons',
        action: 'left',
      });
    } else if (mode === 'join') {
      ReactGA.event({
        category: 'commons',
        action: 'joined',
      });
    } else { 
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    return dispatch(Actions.clickConfirmCommon());
  };
};

module.exports = {
  ...Actions,
  clickConfirmCommon,
};
