const React = require('react');
const { FormattedMessage } = require('react-intl');
const ReCAPTCHA = require('react-google-recaptcha');

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
    const { intl, goToLogin, params, setError } = this.props;
    const _t = x => intl.formatMessage({ id: x });
    return (
      <form 
        key="reset" 
        className="form-login" 
        onSubmit={(e) => {
          e.preventDefault();
          if (this.password !== this.confirmPassword) {
            setError('passwordMismatch');
          } else if (this.captcha == null) {
            setError('confirmHumanity'); 
          } else {
            this.props.resetPassword(this.password, this.token, this.captcha);
          }
        }}
      >
        <h3><FormattedMessage id="section.reset" /></h3>
        <div className="form-group">
          <input 
            id="password" 
            name="password" 
            type="password" 
            onChange={(e) => { this.password = e.target.value; }}
            placeholder={_t('loginForm.placehoder.password')} 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <input 
            id="password2" 
            name="password-confirm" 
            type="password" 
            onChange={(e) => { this.confirmPassword = e.target.value; }}
            placeholder={_t('loginForm.placehoder.password-confirm')} 
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
