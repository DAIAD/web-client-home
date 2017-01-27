const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { push } = require('react-router-redux');
const { injectIntl } = require('react-intl');

const { login, requestPasswordReset, resetPassword } = require('../actions/UserActions');
const { dismissError, setError, setInfo, dismissInfo } = require('../actions/QueryActions');

const Login = require('../components/sections/login/');

function mapStateToProps(state) {
  return {
    errors: state.query.errors,
    info: state.query.info,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    login, 
    dismissError, 
    setError,
    dismissInfo, 
    setInfo,
    requestPasswordReset,
    resetPassword,
    goToResetPassword: () => push('/password/reset/'),
    goToLogin: () => push('/login/'),
  }, dispatch);
}


const LoginData = injectIntl(connect(mapStateToProps, 
                                     mapDispatchToProps
                                    )(Login));
module.exports = LoginData;
