const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const ReCAPTCHA = require('react-google-recaptcha');

const { validatePassword } = require('../../../../utils/general');

function ChangePasswordModal(props) {
  const { _t, profileForm: profile, showChangePassword, actions } = props;
  const { setError, updateProfileForm, changePassword, resetChangePassword } = actions;
  const { password, confirmPassword, captcha } = profile;
  return (
    <bs.Modal 
      animation={false} 
      backdrop="static"
      show={showChangePassword}
      onHide={resetChangePassword} 
      dialogClassName="password-change-modal"
    >
      <form
        id="form-change-password"
        onSubmit={(e) => {
          e.preventDefault();
          
          validatePassword(password, confirmPassword)
          .then(() => {
            changePassword(password, captcha)
            .then(resetChangePassword);
          })
          .catch((error) => {
            setError(error);
          });
        }}
      >
        <bs.Modal.Header closeButton>
          <bs.Modal.Title>
            <FormattedMessage id="profile.changePassword" />
          </bs.Modal.Title>
        </bs.Modal.Header>
        <bs.Modal.Body>
          <div>
            <bs.Input 
              id="password"
              type="password" 
              label={_t('loginForm.placeholder.password')} 
              value={profile.password} 
              onChange={e => updateProfileForm({ password: e.target.value })} 
            />
            <bs.Input 
              id="password-confirm"
              type="password" 
              label={_t('loginForm.placeholder.password-confirm')} 
              value={profile.confirmPassword}
              onChange={e => updateProfileForm({ confirmPassword: e.target.value })} 
            />

            <div className="form-group form-captcha">
              <ReCAPTCHA 
                sitekey={properties.captchaKey}
                theme="light"
                onChange={value => updateProfileForm({ captcha: value })}
              />
            </div>

          </div>

        </bs.Modal.Body>
        <bs.Modal.Footer>
          <button 
            className="btn-a"
            style={{ marginRight: 20 }} 
            onClick={resetChangePassword}
          >
          <FormattedMessage id="forms.cancel" />
        </button>
        <button 
          className="btn-a"
          type="submit"
        >
        <FormattedMessage id="forms.update" />
      </button>
        </bs.Modal.Footer>
      </form>
    </bs.Modal> 
  );
}

module.exports = ChangePasswordModal;
