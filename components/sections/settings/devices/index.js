const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedDate } = require('react-intl');

const MainSection = require('../../../layout/MainSection');
const Dropdown = require('../../../helpers/Dropdown');
const DeviceDetails = require('./DeviceDetails');

const { deviceToDeviceForm } = require('../../../../utils/device');
const { IMAGES, AMPHIRO_PROPERTIES } = require('../../../../constants/HomeConstants');


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
              <DeviceDetails 
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
