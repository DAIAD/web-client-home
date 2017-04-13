const React = require('react');

function Tab(props) {
  return (
    <li 
      key={props.key} 
      role="presentation" 
      className={props.active ? 'active' : ''}
    >
    <a 
      role="tab" 
      tabIndex={props.index}
      onClick={(e) => {
        e.preventDefault();
        props.onSelect(props.eventKey);
      }}
    >
      {
        props.image ? 
          <img 
            className="tab-icon"
            src={props.image} 
            alt={props.key} 
          />
         :
         <i />
      }
      <span>{props.title}</span>
      {
        props.multi && props.active ?
          <i style={{ float: 'right', marginRight: -5, marginTop: 5 }} className="fa fa-times" />
          :
          <i />
      }
      </a>
  </li>
  );
}

function Tabs(props) {
  const horizontal = props.position === 'top' || props.position === 'bottom';
  return (
    <div className={`${props.className} clearfix`}>
      <ul className={`col-xs-20 nav ${horizontal ? 'nav-tabs' : 'nav-pills nav-stacked'}`}>
        {
          props.children.map((child, index) => (
            <Tab 
              {...child.props}
              index={index}
              multi={props.multi}
              active={props.multi ? props.activeKeys.includes(child.props.eventKey) : props.activeKey === child.props.eventKey}
              onSelect={props.onSelect}
            /> 
          ))
        }
      </ul>
    </div>
  );
}

function TabsMulti(props) {
  return (
    <Tabs
      multi
      {...props} 
    />
  );
}

module.exports = {
  Tab,
  Tabs,
  TabsMulti,
};
