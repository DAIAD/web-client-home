const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const MainSection = require('../../layout/MainSection');
const LocaleSwitcher = require('../../LocaleSwitcher');

const { uploadFile } = require('../../../utils/general');

const { COUNTRIES, TIMEZONES } = require('../../../constants/HomeConstants');


function ProfileForm(props) {
  const { intl, profile, locale, errors, actions } = props;
  const { saveToProfile, fetchProfile, setLocale, setForm, setError, dismissError } = actions;
  const setProfileForm = data => setForm('profileForm', data);
  const _t = intl.formatMessage;
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
            src="http://daiad.eu/wp-content/themes/swag/assets/images/daiad-consumer.png"
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
                         setProfileForm({ photo: value }); 
                       }, 
                       (error) => { 
                         setError(error); 
                       }); 
          }}
        />
        <hr />

      <bs.Input 
        type="text" 
        label={_t({ id: 'profile.username' })} 
        defaultValue={profile.username} 
        readOnly 
      />
      <bs.Input 
        type="text" 
        label={_t({ id: 'profile.firstname' })} 
        value={profile.firstname} 
        onChange={e => setProfileForm({ firstname: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t({ id: 'profile.lastname' })} 
        value={profile.lastname}  
        onChange={e => setProfileForm({ lastname: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t({ id: 'profile.address' })} 
        value={profile.address} 
        onChange={e => setProfileForm({ address: e.target.value })} 
      />
      <bs.Input 
        type="text" 
        label={_t({ id: 'profile.zip' })} 
        value={profile.zip}  
        onChange={e => setProfileForm({ zip: e.target.value })} 
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
            _t({ id: `countries.${profile.country}` }) 
            : 
            'Select country'}
          id="country-switcher"
          onSelect={(e, val) => { 
            setProfileForm({ country: val });
          }}
        >
          {
            COUNTRIES.map(country => 
              <bs.MenuItem 
                key={country} 
                eventKey={country} 
                value={country}
              >
                { _t({ id: `countries.${country}` }) }
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
            _t({ id: `timezones.${profile.timezone}` }) 
            : 
            'Select timezone'}
          id="timezone-switcher"
          onSelect={(e, val) => { 
            setProfileForm({ timezone: val });
            //this.setState({timezone: val}); 
          }}
        >
          {
            TIMEZONES.map(timezone => 
              <bs.MenuItem 
                key={timezone} 
                eventKey={timezone} 
                value={timezone}
              >
                { _t({ id: `timezones.${timezone}` }) }
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
          intl={intl}
          setLocale={(val) => { 
            setLocale(val); 
            setProfileForm({ locale: val });
          }}
          locale={locale}
        />
      </div>
      
      <hr />

      <div className="pull-left">
        <bs.ButtonInput 
          type="submit" 
          value={_t({ id: 'forms.submit' })} 
        />
      </div>
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
