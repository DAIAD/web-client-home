const React = require('react');
const { injectIntl, FormattedMessage } = require('react-intl');

const PasswordResetRequestForm = React.createClass({
  componentWillMount: function () {
    this.props.dismissError();
    this.props.dismissInfo();
    this.username = null;
  },
  render: function () {
    const { intl, goToLogin, requestPasswordReset, username } = this.props;
    const _t = x => intl.formatMessage({ id: x });
    return (
      <form 
        key="login" 
        className="form-login" 
        onSubmit={(e) => {
          e.preventDefault();
          requestPasswordReset(this.username);
        }}
      >
        <h3><FormattedMessage id="section.reset" /></h3>
        <div className="form-group">
          <input 
            id="username" 
            name="username" 
            type="text" 
            defaultValue={username}
            onChange={(e) => { this.username = e.target.value; }}
            placeholder={_t('loginForm.placehoder.username')} 
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
          <a onClick={goToLogin}>Back</a>
        </div>
      </form>
    );
  },
});

module.exports = PasswordResetRequestForm;

