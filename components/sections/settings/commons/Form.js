const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');
const Select = require('react-select');

const { uploadFile } = require('../../../../utils/general');
const { IMAGES } = require('../../../../constants/HomeConstants');

function CommonForm(props) {
  const { values, onChange, disabled, errors } = props;
  return (
    <div>
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
            src={`data:image/png;base64,${values.image}`} 
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
        placeholder="Common name..."
        label="Name"
        disabled={disabled}
        onChange={(e) => { onChange({ name: e.target.value }); }}
        value={values.name}
      />
      <bs.Input 
        type="textarea"
        placeholder="Common description..."
        label="Description"
        disabled={disabled}
        onChange={(e) => { onChange({ description: e.target.value }); }}
        value={values.description}
      /> 
    </div>
  );
}

module.exports = CommonForm;
