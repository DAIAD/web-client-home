const React = require('react');
const { FormattedMessage } = require('react-intl');
const ReCAPTCHA = require('react-google-recaptcha');

const { validatePassword } = require('../../../utils/general');

const PasswordResetForm = React.createClass({
  componentWillMount: function () {
    this.props.dismissError();
    this.props.dismissInfo();
    this.password = null;
    this.confirmPassword = null;
    this.captcha = null;
    this.token = this.props.params.token;
  },
  render: function () {
    const { _t, goToLogin, params, setError } = this.props;
    return (
      <form 
        key="reset" 
        className="form-login" 
        onSubmit={(e) => {
          e.preventDefault();
          validatePassword(this.password, this.confirmPassword)
          .then(() => {
            this.props.resetPassword(this.password, this.token, this.captcha)
            .then(goToLogin);
          })
          .catch((error) => {
            setError(error);
          });
        }}
      >
        <h3><FormattedMessage id="section.reset" /></h3>
        <div className="form-group">
          <input 
            id="password" 
            name="password" 
            type="password" 
            onChange={(e) => { this.password = e.target.value; }}
            placeholder={_t('loginForm.placeholder.password')} 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <input 
            id="password-confirm" 
            name="password-confirm" 
            type="password" 
            onChange={(e) => { this.confirmPassword = e.target.value; }}
            placeholder={_t('loginForm.placeholder.password-confirm')} 
            className="form-control" 
          />
        </div>
        
        <div className="form-group form-captcha">
          <ReCAPTCHA 
            sitekey={properties.captchaKey}
            theme="light"
            onChange={(value) => { this.captcha = value; }}
          />
        </div>

        <button 
          type="submit"
          className="btn btn-primary action-reset"
        >
          <FormattedMessage id="loginForm.button.reset-submit" />
        </button> 
        <div className="link-reset"> 
          <a onClick={goToLogin}>Back</a>
        </div>
      </form>
    );
  },
});

module.exports = PasswordResetForm;
