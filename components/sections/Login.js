const React = require('react');
const MainSection = require('../layout/MainSection');
const { injectIntl, FormattedMessage } = require('react-intl');
//const Login = require('../LoginForm');
const { IMAGES } = require('../../constants/HomeConstants');

function PasswordResetForm(props) {
  const { intl, setUsername, onSubmit, onCancel } = props;
  const _t = intl.formatMessage;
  return (
    <form 
      key="login" 
      className="form-login" 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3><FormattedMessage id="section.reset" /></h3>
      <div className="form-group">
        <input 
          id="username" 
          name="username" 
          type="text" 
          onChange={(e) => { setUsername(e.target.value); }}
          placeholder={_t({ id: 'loginForm.placehoder.username' })} 
          className="form-control" 
        />
      </div>
      <button 
        type="submit"
        className="btn btn-primary action-reset"
      >
        <FormattedMessage id="loginForm.button.reset-submit" />
      </button> 
      <div className="link-reset"> 
        <a onClick={onCancel}>Back</a>
      </div>
    </form>
  );
}

function PasswordResetRequestForm(props) {
  const { intl, username, setUsername, onSubmit, onCancel } = props;
  const _t = intl.formatMessage;
  return (
    <form 
      key="login" 
      className="form-login" 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3><FormattedMessage id="section.reset" /></h3>
      <div className="form-group">
        <input 
          id="username" 
          name="username" 
          type="text" 
          defaultValue={username}
          onChange={(e) => { setUsername(e.target.value); }}
          placeholder={_t({ id: 'loginForm.placehoder.username' })} 
          className="form-control" 
        />
      </div>
      <button 
        type="submit"
        className="btn btn-primary action-request-reset"
      >
        <FormattedMessage id="loginForm.button.reset-request" />
      </button> 
      <div className="link-reset"> 
        <a onClick={onCancel}>Back</a>
      </div>
    </form>
  );
}

function LoginForm(props) {
  const { intl, setUsername, setPassword, onSubmit, onReset } = props;
  const _t = intl.formatMessage;
  return (
    <form 
      key="login" 
      className="form-login" 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3><FormattedMessage id="section.login" /></h3>
      <div className="form-group">
        <input 
          id="username" 
          name="username" 
          type="text" 
          onChange={(e) => { setUsername(e.target.value); }}
          placeholder={_t({ id: 'loginForm.placehoder.username' })} 
          className="form-control" 
        />
      </div>
      <div className="form-group" >
        <input 
          id="password" 
          name="password" 
          type="password" 
          onChange={(e) => { setPassword(e.target.value); }}
          placeholder={_t({ id: 'loginForm.placehoder.password' })} 
          className="form-control" 
        />
      </div>
      <button 
        type="submit"
        className="btn btn-primary action-login"
      >
        <FormattedMessage id="loginForm.button.signin" />
      </button> 
      <div className="link-reset"> 
        <a onClick={onReset}>Forgot your password?</a>
      </div>
    </form>
  );
}

const Login = React.createClass({
  componentDidMount: function () {
    this.username = null;
    this.password = null;
  },
  onLogin: function () {
    this.props.login(this.username, this.password);
  },
  onResetRequest: function () {
    //this.props.resetRequest(this.username);
    //this.onSwitchToReset();
    console.log('on reset request', this.username);
    this.props.requestPasswordReset(this.username);
  },
  onReset: function () {
    this.onSwitchToLogin();
  },
  onSwitchToResetRequest: function () {
    this.props.setForgotPassword('requesting');
    this.props.dismissError();
  },
  onSwitchToReset: function () {
    this.props.setForgotPassword('requested');
    this.props.dismissError();
  },
  onSwitchToLogin: function () {
    this.props.setForgotPassword(null);
    this.props.dismissError();
  },
  render: function () {
    const { intl, isAuthenticated, errors, forgotPassword } = this.props;
    if (isAuthenticated) {
      return <div />;
    }
    return (
      <MainSection id="section.login">
        <div className="form-login-container">
          {
            (() => {
              if (forgotPassword === 'requesting') {
                return (
                  <PasswordResetRequestForm
                    intl={intl}
                    username={this.username}
                    setUsername={(username) => { this.username = username; }}
                    onSubmit={this.onResetRequest}
                    onCancel={this.onSwitchToLogin}
                  />
                );
              } else if (forgotPassword === 'requested') {
                return (
                  <PasswordResetForm
                    intl={intl}
                    setUsername={(username) => { this.username = username; }}
                    onSubmit={this.onReset}
                    onCancel={this.onSwitchToLogin}
                  />
                );
              }
              return (
                <LoginForm
                  intl={intl}
                  setUsername={(username) => { this.username = username; }}
                  setPassword={(password) => { this.password = password; }}
                  onSubmit={this.onLogin}
                  onReset={this.onSwitchToResetRequest}
                />
              );
            })()
          }
          <div className="login-errors">
          {
            errors ?
              <span>
                <img src={`${IMAGES}/warning.svg`} alt="error" />
                <FormattedMessage id={`errors.${this.props.errors}`} />
              </span>
              :
              <div />
          }
        </div>
      </div>
    </MainSection>        
    );
  },
});

module.exports = injectIntl(Login);
