const store = require('../store/');

function requireAuth(nextState, replace) {
  if (!store.getState().user.isAuthenticated && !properties.reload) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

module.exports = requireAuth;
