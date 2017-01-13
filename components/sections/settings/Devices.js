const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

const MainSection = require('../../layout/MainSection');

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
      
      <bs.ButtonInput 
        style={{ marginTop: 20, float: 'right' }} 
        type="submit" 
        value={_t({ id: 'forms.submit' })} 
        onClick={(e) => { e.preventDefault(); }} 
      />
    </div>
  );
}


function DevicesForm(props) {
  const { intl, devices } = props;
  const _t = intl.formatMessage;
  return (
    <form id="form-devices">
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
      </bs.Accordion>
    </form>
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
