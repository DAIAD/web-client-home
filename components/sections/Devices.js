const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const MainSection = require('../layout/MainSection');

function Device(props) {
  const _t = props.intl.formatMessage;
  return (
    <div className="col-xs-5" >
      <bs.Input 
        type="text"
        label={_t({ id: 'devices.name' })} 
        defaultValue={props.name} 
      />
      <bs.Input 
        type="text"
        label={_t({ id: 'devices.key' })} 
        defaultValue={props.deviceKey} 
        readOnly 
      />
      {
        (() => {
          if (props.type === 'AMPHIRO') {
            return (
              <bs.Input 
                type="text"
                label={_t({ id: 'devices.mac' })} 
                defaultValue={props.macAddress} 
                readOnly 
              />
            );
          } else if (props.type === 'METER') {
            return (
              <bs.Input 
                type="text"
                label={_t({ id: 'devices.serial' })} 
                defaultValue={props.serial} 
                readOnly 
              />
            );
          }
          return <div />;
        })()
      }
      <hr />  
      <h4><FormattedMessage id="devices.properties" /></h4>
      {
        props.properties.map((property) => {
          if (!property.key) {
            return (<div />);
          }
          return (
            <bs.Input 
              key={property.key} 
              type="text" 
              label={_t({ id: `devices.${property.key}` })} 
              defaultValue={property.value} 
              readOnly 
            />
          );
        })
      }
    </div>
  );
}


function DevicesForm(props) {
  const { intl, devices } = props;
  const _t = intl.formatMessage;
  return (
    <form id="form-devices" style={{ width: '100%', margin: '40px auto' }} >
      <bs.Accordion className="col-xs-10">
        {
          devices.map((device, i) => ( 
            <bs.Panel 
              key={device.deviceKey}
              header={device.name || device.deviceKey}
              eventKey={i}
            >
              <Device {...device} intl={intl} />
            </bs.Panel>
            ))
        }
        <bs.ButtonInput 
          style={{ marginTop: 20 }} 
          type="submit" 
          value={_t({ id: 'forms.submit' })} 
          onClick={(e) => { e.preventDefault(); }} 
        />
      </bs.Accordion>
    </form>
  );
}


function Devices(props) {
  return (
    <MainSection id="section.devices">
      <br />
      <DevicesForm {...props} /> 
    </MainSection>
  );
}

module.exports = Devices;
