const React = require('react');
const { FormattedMessage } = require('react-intl');

const Login = React.createClass({
  componentWillMount: function () {
    this.props.dismissError();
    this.props.dismissInfo();
    this.username = null;
    this.password = null;
  },
  render: function () {
    const { intl, errors, goToResetPassword } = this.props;
    const _t = x => intl.formatMessage({ id: x });
    return (
      <form 
        key="login" 
        className="form-login" 
        onSubmit={(e) => {
          e.preventDefault();
          this.props.login(this.username, this.password);
        }}
      >
        <h3><FormattedMessage id="section.login" /></h3>
        <div className="form-group">
          <input 
            id="username" 
            name="username" 
            type="text" 
            onChange={(e) => { this.username = e.target.value; }}
            placeholder={_t('loginForm.placehoder.username')} 
            className="form-control" 
          />
        </div>
        <div className="form-group" >
          <input 
            id="password" 
            name="password" 
            type="password" 
            onChange={(e) => { this.password = e.target.value; }}
            placeholder={_t('loginForm.placehoder.password')} 
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
          <a onClick={goToResetPassword}>Forgot your password?</a>
        </div>
      </form>
    );
  },
});

module.exports = Login;

