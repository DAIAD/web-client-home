const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const AmphiroProperties = require('./AmphiroProperties');
const MeterProperties = require('./MeterProperties');

const { deviceFormToDevice } = require('../../../../utils/device');

function DeviceDetails(props) {
  const { intl, _t, updateDevice, updateForm, fetchProfile, deviceForm } = props;
  const { name, key, macAddress, type, serial, registeredOn, unit, properties } = deviceForm;
  const { formatMessage, formatDate, formatTime } = props.intl;
  
  return (
    <form 
      className="col-md-8" 
      style={{ minWidth: 265 }}
      onSubmit={(e) => {
        e.preventDefault();
        //Meter not supported
        if (type === 'METER') return;
        updateDevice(deviceFormToDevice(deviceForm))
        .then((p) => {
          fetchProfile();
        });
      }}
    >
    {
      type === 'AMPHIRO' ? 
        <bs.Input 
          type="text"
          value={name}
          onChange={e => updateForm({ name: e.target.value })}
          label={_t('devices.name.label')} 
        />
        :
          <div />
      }

      <bs.Input 
        type="text"
        value={key}
        label={_t('devices.key.label')} 
        readOnly 
      />
       
      <bs.Input 
        type="text"
        label={_t('devices.registeredOn.label')} 
        value={`${formatDate(new Date(registeredOn))} ${formatTime(new Date(registeredOn))}`}
        readOnly 
      />
      {
        (() => {
          if (type === 'AMPHIRO') {
            return (
              <bs.Input 
                type="text"
                label={_t('devices.mac.label')} 
                value={macAddress} 
                readOnly 
              />
            );
          } else if (type === 'METER') {
            return (
              <bs.Input 
                type="text"
                label={_t('devices.serial.label')} 
                value={serial} 
                readOnly 
              />
            );
          }
          return <div />;
        })()
      }
      <br />
      <h4><FormattedMessage id="devices.properties" /></h4>
      <hr />  
      { 
        type === 'AMPHIRO' ? 
          <AmphiroProperties 
            _t={_t} 
            updateForm={updateForm} 
            deviceForm={deviceForm} 
          />
        :
          <MeterProperties 
            _t={_t} 
            {...props} 
          />
      }
      { 
        type === 'AMPHIRO' ?  
          <bs.ButtonInput 
            style={{ marginTop: 20, float: 'right' }} 
            type="submit" 
            value={_t('forms.update')} 
          />
          : <div />
      }
    </form>
  );
}

module.exports = DeviceDetails;
