const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');

const MainSection = require('../../layout/MainSection');
const { deviceToDeviceForm, deviceFormToDevice } = require('../../../utils/device');
const { IMAGES, HEATING_SYSTEMS, AMPHIRO_PROPERTIES } = require('../../../constants/HomeConstants');

function DropdownProperty(props) {
  const { _t, id, type, options, value, update } = props;
  return (
    <div className="form-group">
      <label 
        className="control-label col-md-3" 
        style={{ paddingLeft: 0 }} 
        htmlFor={`${id}-switcher`}
      >
        <span><FormattedMessage id={`devices.${id}.label`} /></span>
      </label>
      <bs.DropdownButton
        title={value != null ? 
          _t(`devices.${id}.${value}`) 
          : 
          _t(`devices.${id}.default`)} 
        id={`${id}-switcher`}
        value={value}
        onSelect={(e, val) => { 
          update(val);
        }}
      >
        {
          options.map(option => 
            <bs.MenuItem 
              key={option} 
              eventKey={option} 
              value={option}
            >
              { _t(`devices.${id}.${option}`) }
            </bs.MenuItem>
            )
        }	
      </bs.DropdownButton>
    </div>
  );
}

function InputProperty(props) {
  const { _t, id, type, options, value, update } = props;
  return (
    <bs.Input 
      value={value}
      style={{ maxWidth: 200 }}
      onChange={e => update(e.target.value)}
      label={_t(`devices.${id}.label`)} 
      help={_t(`devices.${id}.help`)} 
      {...options}
    />
  );
}

function Device(props) {
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
            value={_t('forms.submit')} 
          />
          : <div />
      }
    </form>
  );
}

function AmphiroProperties(props) {
  const { _t, updateForm, deviceForm } = props;
  return (
    <div>
      {
        AMPHIRO_PROPERTIES.map((property) => {
          if (property.type === 'input') {
            return (
              <InputProperty
                key={property.id}
                _t={_t}
                id={property.id}
                value={deviceForm[property.id]}
                update={(val) => { const d = {}; d[property.id] = val; updateForm(d); }}
                options={property.options}
              />
              );
          } else if (property.type === 'select') {
            return (
              <DropdownProperty
                key={property.id}
                _t={_t}
                id={property.id}
                value={deviceForm[property.id]}
                update={(val) => { const d = {}; d[property.id] = val; updateForm(d); }}
                options={property.options}
              />
              );
          }
          return <div />;
        })
      }
    </div>
  );
}

function MeterProperties(props) {
  const { _t, updateForm, deviceForm } = props;
  const { properties } = deviceForm;
  return (
    <span>No properties</span>
  );
}

function DevicesForm(props) {
  const { intl, _t, devices, deviceForm, actions } = props;
  const { updateDevice, updateDeviceForm, fetchProfile } = actions;
  return (
    <div>
      <bs.Accordion 
        className="col-xs-10"
        onSelect={(val) => { 
          updateDeviceForm(deviceToDeviceForm(devices.find(d => d.deviceKey === val)));
        }}
      >
        {
          devices.map(device => ( 
            <bs.Panel 
              key={device.deviceKey}
              header={
                device.type === 'AMPHIRO' ? 
                  <h3>
                    <img style={{ marginRight: 5 }} src={`${IMAGES}/amphiro_small.svg`} alt="devices" />
                    {(device.name || device.deviceKey)}
                  </h3> 
                  : 
                  <h3>
                    <img style={{ marginRight: 5 }} src={`${IMAGES}/water-meter.svg`} alt="meters" />
                    {_t('devices.meter')}
                  </h3>
                  }
              eventKey={device.deviceKey}
            >
              <Device 
                fetchProfile={fetchProfile}
                updateForm={updateDeviceForm}
                updateDevice={updateDevice}
                _t={_t}
                intl={intl}
                deviceForm={deviceForm}
              />
            </bs.Panel>
            ))
        } 
      </bs.Accordion>
    </div>
  );
}


function Devices(props) {
  return (
    <MainSection id="section.devices">
      <div style={{ margin: 20 }}>
        <DevicesForm {...props} /> 
      </div>
    </MainSection>
  );
}

module.exports = Devices;
