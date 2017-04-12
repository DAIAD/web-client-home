const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');

function Dropdown(props) {
  const { _t, id, label, titlePrefix, type, options, update } = props;
  const value = props.value != null ? props.value : props.defaultValue;
  return (
    <div className="form-group">
      <label 
        className="control-label col-md-3" 
        style={{ paddingLeft: 0 }} 
        htmlFor={`${id}-switcher`}
      >
        <span><FormattedMessage id={label} /></span>
      </label>
      <bs.DropdownButton
        title={_t(`${titlePrefix}.${value}`)} 
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
              { _t(`${titlePrefix}.${option}`) }
            </bs.MenuItem>
            )
        }	
      </bs.DropdownButton>
    </div>
  );
}

module.exports = Dropdown;
