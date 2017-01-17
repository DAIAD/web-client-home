const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');

const MainSection = require('../../layout/MainSection');
const { fromDeviceForm, toDeviceForm } = require('../../../utils/device');
const { HEATING_SYSTEMS } = require('../../../constants/HomeConstants');


function Device(props) {
  const { intl, updateDevice, updateForm, fetchProfile, deviceForm } = props;
  const { name, key, macAddress, type, serial, registeredOn, unit, properties } = deviceForm;
  const { formatMessage, formatDate, formatTime } = props.intl;
  
  const _t = x => intl.formatMessage({ id: x });
  return (
    <form 
      className="col-md-8" 
      style={{ minWidth: 265 }}
      onSubmit={(e) => {
        e.preventDefault();
        //Meter not supported
        if (type === 'METER') return;
        updateDevice(fromDeviceForm(deviceForm))
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
          <AmphiroProperties _t={_t} {...props} />
        :
          <MeterProperties _t={_t} {...props} />
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
  const { heatingSystem, heatingEfficiency, costEnergy, costWater, shareOfSolar } = deviceForm;
  return (
    <div>
      <div className="form-group">
        <label 
          className="control-label col-md-3" 
          style={{ paddingLeft: 0 }} 
          htmlFor="heating-system-switcher"
        >
          <span><FormattedMessage id="devices.heating-system.label" /></span>
        </label>
        <bs.DropdownButton
          title={heatingSystem != null ? 
            _t(`devices.heating-system.${heatingSystem}`) 
            : 
            _t('devices.heating-system.default')} 
          id="heating-system-switcher"
          value={heatingSystem}
          onSelect={(e, val) => { 
            updateForm({ heatingSystem: val });
          }}
        >
          {
            HEATING_SYSTEMS.map((system, i) => 
              <bs.MenuItem 
                key={system} 
                eventKey={i} 
                value={system}
              >
                { _t(`devices.heating-system.${i}`) }
              </bs.MenuItem>
              )
          }	
        </bs.DropdownButton>
      </div>
      <br />

      <bs.Input
        type="number"
        min="0"
        max="100"
        step="1"
        label={_t('devices.heating-efficiency.label')} 
        help={_t('devices.heating-efficiency.help')} 
        value={parseInt(heatingEfficiency, 0)} 
        onChange={(e) => { 
            updateForm({ heatingEfficiency: e.target.value });
        }}
        style={{ maxWidth: 200 }}
      />
    
      <bs.Input
        type="number"
        min="0"
        max="100"
        step="1"
        label={_t('devices.cost-energy.label')} 
        help={_t('devices.cost-energy.help')} 
        value={parseInt(costEnergy, 0)} 
        onChange={(e) => { 
            updateForm({ costEnergy: e.target.value });
        }}
        style={{ maxWidth: 200 }}
      />

      <bs.Input
        type="number"
        min="0"
        max="100"
        step="1"
        label={_t('devices.cost-water.label')} 
        help={_t('devices.cost-water.help')} 
        value={parseInt(costWater, 0)} 
        onChange={(e) => { 
            updateForm({ costWater: e.target.value });
        }}
        style={{ maxWidth: 200 }}
      />

      <bs.Input
        type="number"
        min="0"
        max="100"
        step="1"
        label={_t('devices.share-of-solar.label')} 
        help={_t('devices.share-of-solar.help')} 
        value={parseInt(shareOfSolar, 0)} 
        onChange={(e) => { 
            updateForm({ shareOfSolar: e.target.value });
        }}
        style={{ maxWidth: 200 }}
      />
    

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
  const { intl, devices, deviceForm, actions } = props;
  const { updateDevice, setForm, resetForm, fetchProfile } = actions;
  const _t = x => intl.formatMessage({ id: x });
  return (
    <div>
      <bs.Accordion 
        className="col-xs-10"
        onSelect={(val) => { 
          resetForm('deviceForm');
          setTimeout(() => setForm('deviceForm', toDeviceForm(devices.find(d => d.deviceKey === val))), 300); 
        }}
      >
        {
          devices.map(device => ( 
            <bs.Panel 
              key={device.deviceKey}
              header={device.type === 'AMPHIRO' ? (device.name || device.deviceKey) : _t('devices.meter')}
              eventKey={device.deviceKey}
            >
              <Device 
                fetchProfile={fetchProfile}
                updateForm={v => setForm('deviceForm', v)}
                updateDevice={updateDevice}
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
