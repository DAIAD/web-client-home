const React = require('react');
const bs = require('react-bootstrap');

const Dropdown = require('../../../helpers/Dropdown');

const { AMPHIRO_PROPERTIES } = require('../../../../constants/HomeConstants');

function AmphiroProperties(props) {
  const { _t, updateForm, deviceForm } = props;
  return (
    <div>
      {
        AMPHIRO_PROPERTIES.map((property) => {
          if (property.type === 'input') {
            return (
              <bs.Input
                id={`${deviceForm.name}-${property.id}`}
                style={{ maxWidth: 200 }}
                type={property.type}
                value={deviceForm[property.id]}
                onChange={(e) => { const d = {}; d[property.id] = e.target.value; updateForm(d); }}
                label={_t(`devices.${property.id}.label`)} 
                help={_t(`devices.${property.id}.help`)} 
                {...property.options}
              />
              );
          } else if (property.type === 'select') {
            return (
              <Dropdown
                _t={_t}
                id={`${deviceForm.name}-${property.id}`}
                label={`devices.${property.id}.label`}
                titlePrefix={`devices.${property.id}`}
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

module.exports = AmphiroProperties;
