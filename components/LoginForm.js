const React = require('react');
const { FormattedMessage } = require('react-intl');
const { IMAGES } = require('../constants/HomeConstants');


const Login = React.createClass({
  componentDidMount: function () {
    this.username = null;
    this.password = null;
  },
  onLogin: function (e) {
    e.preventDefault();
    this.props.login(this.username, this.password);
  }, 
  render: function () {
    const { intl, isAuthenticated } = this.props;
    const _t = intl.formatMessage;
    return isAuthenticated ? 
      <div />
      : ( 
      <div className="form-login-container">
        <h3><FormattedMessage id="section.login" /></h3>
        <form key="login" className="form-login" action={this.props.action}>
          <div className="form-group">
            <input 
              id="username" 
              name="username" 
              type="text" 
              onChange={(e) => { this.username = e.target.value; }}
              placeholder={_t({ id: 'loginForm.placehoder.username' })} 
              className="form-control" 
            />
          </div>
          <div className="form-group" >
            <input 
              id="password" 
              name="password" 
              type="password" 
              onChange={(e) => { this.password = e.target.value; }}
              placeholder={_t({ id: 'loginForm.placehoder.password' })} 
              className="form-control" 
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary action-login"
            onClick={this.onLogin} 
          >
            <FormattedMessage id="loginForm.button.signin" />
          </button> 
        </form>
        <div className="login-errors">
          {
            this.props.errors ?
              <span>
                <img src={`${IMAGES}/warning.svg`} alt="error" />
                <FormattedMessage id={`errors.${this.props.errors}`} />
              </span>
              :
              <div />
          }
        </div>
      </div>
      );
  }

});


module.exports = Login;
