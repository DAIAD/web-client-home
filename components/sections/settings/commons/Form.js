const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');

const { uploadFile } = require('../../../../utils/general');
const { IMAGES, BASE64 } = require('../../../../constants/HomeConstants');

function CommonForm(props) {
  const { _t, values, onChange, disabled, errors } = props;
  return (
    <div className="commons-form-fields">
      { 
        values.image ? 
          <img 
            style={{ 
              marginTop: -5, 
              marginBottom: 20,
              height: 100,
              width: 100,
              border: '2px #2D3580 solid',
            }} 
            src={`${BASE64}${values.image}`} 
            alt="commons" 
          />
          :
          <img 
            style={{ 
              marginTop: -5, 
              marginBottom: 20,
              height: 100,
              width: 100,
              background: '#2D3580',
              border: '2px #2D3580 solid',
            }} 
            src={`${IMAGES}/commons-menu.svg`} 
            alt="commons-default" 
          />
      }
      { !disabled ? 
      <input
        id="file-uploader"
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          uploadFile(file,
                     (value) => {
                       //if (errors) { dismissError(); }
                       onChange({ image: value });
                     },
                     (error) => {
                       console.error('error uploading', error);
                       //setError(error);
                     });
        }}
      />
      : <div />
      }
      <hr />
      <bs.Input 
        type="text"
        placeholder={_t('commonsManage.placeholder-name')}
        label={_t('commonsManage.name')}
        disabled={disabled}
        onChange={(e) => { onChange({ name: e.target.value }); }}
        value={values.name}
      />
      <bs.Input 
        type="textarea"
        placeholder={_t('commonsManage.placeholder-description')}
        label={_t('commonsManage.description')}
        disabled={disabled}
        onChange={(e) => { onChange({ description: e.target.value }); }}
        value={values.description}
      /> 
    </div>
  );
}

module.exports = CommonForm;
