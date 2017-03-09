const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const ReCAPTCHA = require('react-google-recaptcha');

const MainSection = require('../../layout/MainSection');
const LocaleSwitcher = require('../../LocaleSwitcher');

const { uploadFile, validatePassword } = require('../../../utils/general');

const { COUNTRIES, TIMEZONES, SYSTEM_UNITS, PNG_IMAGES } = require('../../../constants/HomeConstants');


function ChangePassword(props) {
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
      bsSize="md"
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
           Change Password
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
          <bs.Button style={{ marginRight: 20 }} onClick={resetChangePassword}>Cancel</bs.Button>
          <bs.Button type="submit">Update</bs.Button>
        </bs.Modal.Footer>
      </form>
    </bs.Modal> 
  );
}

function ProfileForm(props) {
  const { _t, profileForm: profile, locale, errors, actions } = props;
  const { saveToProfile, updateProfileForm, fetchProfile, setLocale, setForm, setError, dismissError, changePassword, setChangePassword } = actions;
  return (
    <form 
      id="form-profile" 
      style={{ width: 400 }} 
      onSubmit={(e) => { 
        e.preventDefault(); 
        saveToProfile(JSON.parse(JSON.stringify(profile)))
        .then((p) => {
          fetchProfile();
        });
      }}
    >
      { 
        profile.photo ? 
          <img 
            style={{ 
              marginTop: -5, 
              marginBottom: 20,
              height: 100,
              width: 100,
              border: '2px #2D3580 solid',
            }} 
            src={`data:image/png;base64,${profile.photo}`} 
            alt="profile" 
          />
          :
          <img 
            style={{ 
              marginTop: -5, 
              marginBottom: 20,
              height: 100,
              width: 100,
              border: '2px #2D3580 solid',
            }} 
            src={`${PNG_IMAGES}/daiad-consumer.png`} 
            alt="profile" 
          />
      }
      <input
        id="file-uploader"
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          uploadFile(file,
                     (value) => {
                       if (errors) { dismissError(); }
                       updateProfileForm({ photo: value });
                     },
                     (error) => {
                       setError(error);
                     });
        }}
      />
      <hr />
  
      <bs.Input 
        type="text" 
        label={_t('profile.username')} 
        defaultValue={profile.username} 
        readOnly 
      />

      <bs.Button onClick={setChangePassword}>
        Change password
      </bs.Button>
      <br />
      <br />

      <bs.Input 
        type="text" 
        label={_t('profile.firstname')} 
        value={profile.firstname} 
        onChange={e => updateProfileForm({ firstname: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t('profile.lastname')} 
        value={profile.lastname}  
        onChange={e => updateProfileForm({ lastname: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t('profile.address')} 
        value={profile.address} 
        onChange={e => updateProfileForm({ address: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t('profile.zip')} 
        value={profile.zip}  
        onChange={e => updateProfileForm({ zip: e.target.value })} 
      />

      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="country-switcher"
        >
          <span><FormattedMessage id="profile.country" /></span>
        </label>
        <bs.DropdownButton
          title={profile.country ? 
            _t(`countries.${profile.country}`) 
            : 
            'Select country'}
          id="country-switcher"
          onSelect={(e, val) => { 
            updateProfileForm({ country: val });
          }}
        >
          {
            COUNTRIES.map(country => 
              <bs.MenuItem 
                key={country} 
                eventKey={country} 
                value={country}
              >
                { _t(`countries.${country}`) }
              </bs.MenuItem>
              )
          }	
        </bs.DropdownButton>
      </div>

      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="unit-switcher"
        >
          <span><FormattedMessage id="profile.unit.label" /></span>
        </label>
        <bs.DropdownButton
          id="unit-switcher"
          title={profile.unit != null ? 
            _t(`profile.unit.${profile.unit.toLowerCase()}`) 
            : 
            _t('profile.unit.default')}
          value={profile.unit}
          onSelect={(e, val) => { 
            updateProfileForm({ unit: val });
          }}
        >
          {
            SYSTEM_UNITS.map(mu => 
              <bs.MenuItem 
                key={mu} 
                eventKey={mu.toUpperCase()} 
                value={mu}
              >
                { _t(`profile.unit.${mu}`) }
              </bs.MenuItem>
              )
          }	
        </bs.DropdownButton>
      </div>
      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="timezone-switcher"
        >
          <span><FormattedMessage id="profile.timezone" /></span>
        </label>
        <bs.DropdownButton
          title={profile.timezone ? 
            _t(`timezones.${profile.timezone}`) 
            : 
            'Select timezone'}
          id="timezone-switcher"
          onSelect={(e, val) => { 
            updateProfileForm({ timezone: val });
          }}
        >
          {
            TIMEZONES.map(timezone => 
              <bs.MenuItem 
                key={timezone} 
                eventKey={timezone} 
                value={timezone}
              >
                { _t(`timezones.${timezone}`) }
              </bs.MenuItem>
            )
          }	
        </bs.DropdownButton>
      </div>
      
      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="locale-switcher"
        >
          <span><FormattedMessage id="profile.locale" /></span>
        </label>
        <LocaleSwitcher
          id="locale-switcher"
          _t={_t}
          setLocale={(val) => { 
            setLocale(val); 
            updateProfileForm({ locale: val });
          }}
          locale={locale}
        />
      </div>
      
      <hr />

      <div className="pull-left">
        <bs.ButtonInput 
          type="submit" 
          value={_t('forms.submit')} 
        />
      </div>

      <ChangePassword
        {...props}
      />

    </form>
  );
}

function Profile(props) {
  return (
    <MainSection id="section.profile">
      <div style={{ margin: 20 }}>
        <ProfileForm 
          {...props} 
        /> 
    </div>
    </MainSection>
  );
}

module.exports = Profile;
