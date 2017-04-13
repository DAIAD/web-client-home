const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const Dropdown = require('../../../helpers/Dropdown');

const { uploadFile } = require('../../../../utils/general');
const { PNG_IMAGES, BASE64 } = require('../../../../constants/HomeConstants');

function MemberFormFields(props) {
  const { _t, errors, member, fetchProfile, updateMemberForm, setError, dismissError, goTo } = props;
  return (
    <div className="member-form-fields"> 
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
            src={`${BASE64}${member.photo}`} 
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
        placeholder={_t('member.placeholder-name')}
        onChange={(e) => { updateMemberForm({ name: e.target.value }); }}
        value={member.name}
      />

      <bs.Input 
        type="number"
        min="0"
        placeholder={_t('member.placeholder-age')}
        label={_t('member.age')}
        onChange={(e) => { updateMemberForm({ age: parseInt(e.target.value, 0) }); }}
        value={member.age}
      /> 
        
      <Dropdown
        _t={_t}
        id={`member-gender-${member.index}`}
        label="member.gender"
        defaultValue="FEMALE"
        titlePrefix="member"
        value={member.gender}
        update={val => updateMemberForm({ gender: val })}
        options={['FEMALE', 'MALE']}
      />
    </div>
  );
}

module.exports = MemberFormFields;
