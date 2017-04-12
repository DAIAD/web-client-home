const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const MainSection = require('../../../layout/MainSection');
const LocaleSwitcher = require('../../../helpers/LocaleSwitcher');
const Dropdown = require('../../../helpers/Dropdown');
const ChangePasswordModal = require('./ChangePasswordModal');

const { uploadFile, validatePassword } = require('../../../../utils/general');

const { COUNTRIES, TIMEZONES, SYSTEM_UNITS, PNG_IMAGES, BASE64 } = require('../../../../constants/HomeConstants');


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
            src={`${BASE64}${profile.photo}`} 
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
        <FormattedMessage id="profile.changePassword" />
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
      
      <Dropdown
        _t={_t}
        id="country"
        label="profile.country"
        defaultValue="Spain"
        titlePrefix="countries"
        value={profile.country}
        update={val => updateProfileForm({ country: val })}
        options={COUNTRIES}
      />

      <Dropdown
        _t={_t}
        id="unit"
        label="profile.unit.label"
        defaultValue="metric"
        titlePrefix="profile.unit"
        value={profile.unit}
        update={val => updateProfileForm({ unit: val })}
        options={SYSTEM_UNITS.map(u => u.toLowerCase())}
      />

    
      <Dropdown
        _t={_t}
        id="timezone"
        label="profile.timezone"
        defaultValue={TIMEZONES[0]}
        titlePrefix="timezones"
        value={profile.timezone}
        update={val => updateProfileForm({ timezone: val })}
        options={TIMEZONES}
      />
      
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
          value={_t('forms.update')} 
        />
      </div>

      <ChangePasswordModal
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
