const React = require('react');
const bs = require('react-bootstrap');

function ShowerMember(props) {
  const { deviceKey, sessionId, member, memberFilter, members, assignToMember, editShower, disableEditShower, fetchAndSetQuery } = props;
  return (
    <div className="headline-user">
      <i className="fa fa-user" />
      { editShower ? 
        <div style={{ float: 'right' }}>
          <bs.DropdownButton
            title={member}
            id="shower-user-switcher"
            onSelect={(e, val) => { 
              assignToMember({ 
                deviceKey, 
                sessionId, 
                memberIndex: val, 
              })
              .then(() => fetchAndSetQuery({ active: memberFilter === 'all' ? [deviceKey, sessionId] : null })) 
              .then(() => disableEditShower());
            }}
          >
            {
              members.map(m => 
                <bs.MenuItem 
                  key={m.id} 
                  eventKey={m.index} 
                  value={m.index}
                >
                { m.name }
                </bs.MenuItem>
                )
            }
          </bs.DropdownButton>
      </div>
      :
      <div style={{ float: 'right' }}>
        <span style={{ margin: '0 15px' }}>{member}</span>
        </div>  
      }
    </div>
  );
}

module.exports = ShowerMember;
