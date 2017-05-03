const React = require('react');
const { FormattedMessage } = require('react-intl');
const bs = require('react-bootstrap');

const { PNG_IMAGES } = require('../../../constants/HomeConstants');

function AddWidgetForm(props) {
  const { widgetToAdd, widgetTypes, deviceTypes, setForm, activeDeviceType, setDeviceType, setWidgetToAdd, onSubmit, _t } = props;
  const { title, description, id } = widgetToAdd;
  return (
    <div>
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
                  <li  
                    key={idx} 
                    className={`add-widget-type ${t.display} ${t.id === id ? 'selected' : ''}`}
                  >
                    <button
                      className="btn-a"
                      onClick={() => setWidgetToAdd(t)} 
                      value={t.id}
                      title={t.description}
                    >
                    { t.image ? 
                      <div className="wrapper"> 
                        <img
                          src={`${PNG_IMAGES}/${t.image}`} 
                          alt={t.id}
                        />
                        <span className="mask" />
                        <h6 className="title">{t.title}</h6>
                    </div>
                      :
                        <div className="wrapper"> 
                          <span className="mask" />
                          <h6 className="title">{t.title}</h6>
                        </div>
                      }
                    </button>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
        <div className="add-widget-right">
          <div>
            <h5>{ title }</h5>
            <p>
              { description }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddWidgetModal(props) {
  const { widgetToAdd, showModal, switchMode, addWidget, metrics, widgetTypes, deviceTypes, 
    setForm, activeDeviceType, setDeviceType, setWidgetToAdd, resetWidgetToAdd, _t } = props;
    
  const onSubmit = (e) => { 
    e.preventDefault();
    addWidget(widgetToAdd); 
    resetWidgetToAdd();
    switchMode('normal'); 
  };
  const onHide = (e) => {
    e.preventDefault();
    resetWidgetToAdd();
    switchMode('normal');
  };

  return (
    <bs.Modal 
      animation={false} 
      className="add-widget-modal" 
      show={showModal} 
      onHide={onHide} 
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
        <button className="btn-a" onClick={onHide}>
          <FormattedMessage id="forms.cancel" />
        </button>
        <button
          className="btn-a"
          style={{ marginLeft: 20 }} 
          onClick={onSubmit}
        >
          <FormattedMessage id="forms.add" />
        </button>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

module.exports = AddWidgetModal;
