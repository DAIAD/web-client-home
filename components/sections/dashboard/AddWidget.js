const React = require('react');
const { FormattedMessage } = require('react-intl');
const bs = require('react-bootstrap');

function AddWidgetForm(props) {
  const { widgetToAdd, widgetTypes, deviceTypes, setForm, activeDeviceType, setDeviceType, setWidgetToAdd, onSubmit, _t } = props;
  const { title, description, id } = widgetToAdd;
  return (
    <form onSubmit={onSubmit}>
      <bs.Tabs 
        className="history-time-nav" 
        position="top" 
        tabWidth={3} 
        activeKey={activeDeviceType} 
        onSelect={key => setDeviceType(key)}
      >
        {
          deviceTypes.map(devType =>
            <bs.Tab 
              key={devType.id} 
              eventKey={devType.id} 
              title={_t(devType.title)} 
            />
            )
        } 
      </bs.Tabs>
      <div className="add-widget">
        <div className="add-widget-left">
          <div>
            <ul className="add-widget-types">
              {
                widgetTypes.map((t, idx) =>
                  <li key={idx}>
                    <a 
                      className={id === t.id ? 'selected' : ''}  
                      onClick={() => setWidgetToAdd({ 
                        ...t, 
                        title: _t(`widget.titles.${t.id}`), 
                      })} 
                      value={t.id}
                    >
                      {_t(`widget.titles.${t.id}`)}
                    </a>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
        <div className="add-widget-right">
          <div style={{ padding: 10 }}>
            <input 
              type="text" 
              placeholder={_t('dashboard.add-widget-placeholder')}
              readOnly={title == null}
              value={title}
              onChange={e => setWidgetToAdd({ title: e.target.value })}
            />
            <p>
              { id ? _t(`widget.descriptions.${id}`) : null }
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function AddWidgetModal(props) {
  const { widgetToAdd, showModal, switchMode, addWidget, metrics, widgetTypes, deviceTypes, 
    setForm, activeDeviceType, setDeviceType, setWidgetToAdd, _t } = props;
    
  const onSubmit = (e) => { 
    e.preventDefault();
    addWidget(widgetToAdd); 
    switchMode('normal'); 
  };
  return (
    <bs.Modal 
      animation={false} 
      className="add-widget-modal" 
      show={showModal} 
      onHide={() => switchMode('normal')} 
      bsSize="large" 
      backdrop="static"
    >
      <bs.Modal.Header closeButton>
        <bs.Modal.Title>
          <FormattedMessage id="dashboard.add" />
        </bs.Modal.Title>
      </bs.Modal.Header>
      <bs.Modal.Body>
        <AddWidgetForm 
          {...{ 
            metrics, 
            widgetToAdd,
            widgetTypes, 
            deviceTypes, 
            setForm, 
            setDeviceType,
            activeDeviceType,
            setWidgetToAdd,
            onSubmit,
            _t,
            
          }} 
        /> 
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <a onClick={() => switchMode('normal')}>
          <FormattedMessage id="forms.cancel" />
        </a>
        <a 
          style={{ marginLeft: 20 }} 
          onClick={onSubmit}
        >
          <FormattedMessage id="forms.add" />
        </a>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

module.exports = AddWidgetModal;
