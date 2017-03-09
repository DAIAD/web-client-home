const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const { uploadFile } = require('../../../../utils/general');
const { PNG_IMAGES } = require('../../../../constants/HomeConstants');

function MemberFormFields(props) {
  const { _t, errors, member, fetchProfile, updateMemberForm, setError, dismissError, goTo } = props;
  return (
    <div> 
      { 
        member.photo ? 
          <img 
            style={{ 
              marginTop: -5, 
              marginBottom: 20,
              height: 100,
              width: 100,
              border: '2px #2D3580 solid',
            }} 
            src={`data:image/png;base64,${member.photo}`} 
            alt="member" 
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
            alt="member" 
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
                       updateMemberForm({ photo: value });
                     },
                     (error) => {
                       setError(error);
                     });
        }}
      />
      <hr />
  
      <bs.Input 
        type="text" 
        label={_t('member.name')}
        placeholder="Member name"
        onChange={(e) => { updateMemberForm({ name: e.target.value }); }}
        value={member.name}
      />

      <bs.Input 
        type="number"
        min="0"
        placeholder="Member age"
        label={_t('member.age')}
        onChange={(e) => { updateMemberForm({ age: parseInt(e.target.value, 0) }); }}
        value={member.age}
      /> 


      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="gender-switcher"
        >
          <span><FormattedMessage id="member.gender" /></span>
        </label>

        <bs.DropdownButton
          title={member.gender ? 
            _t(`member.${member.gender}`) 
            : 
            'Select gender'}
          id="gender-switcher"
          onSelect={(e, val) => { 
            updateMemberForm({ gender: val });
          }}
        >
          {
            ['MALE', 'FEMALE'].map(gender => 
              <bs.MenuItem 
                key={gender} 
                eventKey={gender} 
                value={gender}
              >
                { _t(`member.${gender}`) }
              </bs.MenuItem>
              )
          }	
        </bs.DropdownButton>
      </div>
    </div>
  );
}

module.exports = MemberFormFields;
