const React = require('react');
const MainSection = require('../layout/MainSection');
const { injectIntl } = require('react-intl');
const Login = require('../LoginForm');

function LoginPage(props) {
  return (
    <MainSection id="section.login">
      <Login {...props} />
    </MainSection>        
  );
}

module.exports = injectIntl(LoginPage);
