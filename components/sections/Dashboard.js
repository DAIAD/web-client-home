const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedRelative } = require('react-intl');
const { Responsive, WidthProvider } = require('react-grid-layout');
const { Link } = require('react-router');

const MainSection = require('../layout/MainSection');
const ChartWidget = require('../helpers/ChartWidget');

const { IMAGES } = require('../../constants/HomeConstants');

const ResponsiveGridLayout = WidthProvider(Responsive);

function ErrorDisplay(props) {
  return props.errors ? 
    <div style={{ zIndex: 100 }}>
      <img src={`${IMAGES}/alert.svg`} alt="error" />
      <span className="widget-error">{`${props.errors}`}</span>
    </div>
    :
    <div />;
}


/* Be Polite, greet user */
function SayHello(props) {
  return (
    <div style={{ margin: '40px 30px 20px 30px' }}>
      <h3>
        <FormattedMessage 
          id="dashboard.hello" 
          values={{ name: props.firstname }} 
        />
      </h3>
    </div>
  );
}

const WidgetItem = React.createClass({
  getInitialState: function () {
    return {
      el: null 
    };
  },
  render: function () {
    const { widget, updateWidget, removeWidget, _t, linkToHistory, width } = this.props;
    const { id, error, period, type, display, periods, time } = widget;
    return (
      <div 
        className="widget"
        ref={(el) => { if (!this.state.el) { this.setState({ el }); } }}
      >
        <div className="widget-header">
          <div className="header-left">
            <h4>{widget.title}</h4>
          </div>

          <div className="header-right">
            <div>
              {
                periods && periods.map(p => (
                  <a 
                    key={p.id} 
                    onClick={() => updateWidget(id, { period: p.id })} 
                    style={{ marginLeft: 5 }}
                  >
                    {
                      p.id === period ? 
                        <u>{_t(p.title)}</u>
                        :
                         _t(p.title)
                    }
                  </a>
                  ))
              }
            </div>
            {
              type === 'last' && time ? 
                <FormattedRelative value={time} /> 
                  : 
                  <span />
            }
            {
              <a 
                className="widget-x" 
                style={{ float: 'right', marginLeft: 5, marginRight: 5 }} 
                onClick={() => removeWidget(widget.id)}
              >
                <i className="fa fa-times" />
              </a>
            }
          </div>
        </div>
        
        <div className="widget-body">
          {
            (() => {
              if (error) {
                return (<ErrorDisplay errors={error} />);
              } 
              if (display === 'stat') {
                return (
                  <StatWidget {...this.props} /> 
                );
              } else if (display === 'chart') {
                return (
                  <ChartWidget
                    {...widget} 
                    width={this.state.el ? this.state.el.clientWidth : '100%'}
                    height={this.state.el ? this.state.el.clientHeight - 90 : null}
                  /> 
                );
              } else if (display === 'tip') {
                return (
                  <TipWidget {...this.props} />
                );
              }
              return <div />;
            }
            )()
           }
        </div>
        <div className="widget-footer">
          <a onClick={() => linkToHistory(widget)}>See more</a>
        </div>
      </div>
    );
  }
});

function StatWidget(props) {
  const { deviceType, highlight, period, better, comparePercentage, mu } = props.widget;
  
  //const duration = data?(Array.isArray(data)?null:data.duration):null;
  const arrowClass = better ? 'fa-arrow-down green' : 'fa-arrow-up red';
  const bow = !(better == null || comparePercentage == null);
  const str = better ? 'better' : 'worse';
  return (
    <div style={{ padding: 10, marginLeft: 10 }}>
      <div style={{ float: 'left', width: '50%' }}>
        <h2>
          <span>{highlight}</span>
          <span style={{ fontSize: '0.5em', marginLeft: 5 }}>{mu}</span>
        </h2>
      </div>
      <div style={{ float: 'left', width: '50%' }}>
        <div>
          {
            (() => {
              if (bow) {
                return (
                  <span>
                    <i className={`fa ${arrowClass}`} style={{ marginRight: 5 }} />
                    {
                      deviceType === 'AMPHIRO' ? 
                        `${comparePercentage}% ${str} than previous ${period}!` 
                        : 
                        `${comparePercentage}% ${str} than last ${period} so far!` 
                    }
                  </span>
                );
              }
              return <span>No comparison data</span>;
            })()
          }
        </div>
      </div>
    </div>
  );
}

function TipWidget(props) {
  const { highlight } = props.widget;
  return (
    <div >
      <p>{highlight}</p>
    </div>
  );
}

function WidgetPanel(props) {
  const { _t, mode, layout, widgets, updateLayout, updateWidget, removeWidget, 
    periods, linkToHistory, width } = props;
  return (
    <ResponsiveGridLayout 
      className="layout"
      layouts={{ lg: layout, md: layout, sm: layout }}
      breakpoints={{ lg: 1080, md: 650, sm: 200 }}
      cols={{ lg: 8, md: 4, sm: 2 }}
      rowHeight={160}
      measureBeforeMount
      draggableHandle=".widget-header"
      resizable
      draggable
      onResizeStop={(newLayout) => { 
        updateLayout(newLayout);  
      }}
      onDragStop={(newLayout) => {
        updateLayout(newLayout); 
      }} 
      onLayoutChange={(newLayout) => {
      }}
      onBreakpointChange={(newBreakpoint) => {
      }}
    >
      {
       widgets.map(widget => (
         <div key={widget.id}>
           <WidgetItem 
             {...{
               mode, 
               periods, 
               widget, 
               updateWidget, 
               removeWidget, 
               _t,
               linkToHistory,
               width,
             }} 
           /> 
         </div>
         ))
      }
    </ResponsiveGridLayout>
  );
}

function ButtonToolbar(props) {
  const { switchMode, resetDirty, saveToProfile, dirty } = props;
  return (
    <div className="dashboard-button-toolbar">
      <a 
        className="btn dashboard-add-btn" 
        onClick={() => switchMode('add')} 
        active={false}
      >
        Add Widget
      </a>
      {
        dirty ? 
          <div className="dashboard-save">
            <h6>Save changes?</h6>
            <div className="dashboard-save-prompt">
              <button 
                className="btn dashboard-save-btn" 
                onClick={() => {
                  saveToProfile()
                  .then(() => resetDirty());
                }} 
                active={false}
              >
                Yes
              </button>
              <button 
                className="btn dashboard-discard-btn" 
                onClick={() => resetDirty()} 
                active={false}
              >
                No
              </button>
            </div>
          </div>
          :
          <div />
      }
    </div>
  );
}

function AddWidgetForm(props) {
  const { widgetToAdd, widgetTypes, deviceTypes, setForm, activeDeviceType, setDeviceType, setWidgetToAdd, onSubmit } = props;
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
              title={devType.title} 
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
                      onClick={() => setWidgetToAdd(t)} 
                      value={t.id}
                    >
                      {t.title}
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
              placeholder="Enter title..."
              readOnly={title == null}
              value={title}
              onChange={e => setWidgetToAdd({ title: e.target.value })}
            />
            <p>
              { description }
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function AddWidgetModal(props) {
  const { widgetToAdd, showModal, switchMode, addWidget, metrics, widgetTypes, deviceTypes, 
    setForm, activeDeviceType, setDeviceType, setWidgetToAdd } = props;
    
  const onSubmit = (e) => { 
    e.preventDefault();
    addWidget(widgetToAdd); 
    switchMode('normal'); 
  };
  return (
    <bs.Modal 
      animation={false} 
      className="add-widget-modal" 
      show={showModal} onHide={() => switchMode('normal')} 
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
            
          }} 
        /> 
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <a onClick={() => switchMode('normal')}>Cancel</a>
        <a 
          style={{ marginLeft: 20 }} 
          onClick={onSubmit}
        >
          Add
        </a>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

const Dashboard = React.createClass({
  //mixins: [ PureRenderMixin ],

  componentWillMount: function () {
    //const { fetchAllWidgetesData, switchMode } = this.props;
    //switchMode("normal");
    //fetchAllWidgetesData();
  },
  
  render: function () {
    const { firstname, mode, dirty, switchMode, addWidget, saveToProfile, 
      setDirty, resetDirty, deviceCount, meterCount, metrics, widgetTypes, 
      deviceTypes, widgetToAdd, setForm, activeDeviceType, setDeviceType, 
      setWidgetToAdd } = this.props;
    return (
      <MainSection id="section.dashboard">
        <div className="dashboard">
          <div className="dashboard-infopanel">
            <SayHello firstname={firstname} />
            <AddWidgetModal 
              {...{
                showModal: mode === 'add', 
                switchMode, 
                addWidget, 
                widgetToAdd,
                metrics, 
                widgetTypes, 
                deviceTypes, 
                setForm,
                activeDeviceType, 
                setDeviceType,
                setWidgetToAdd,
              }} 
            />

            <WidgetPanel {...this.props} />

          </div>
          <div className="dashboard-right">
            <div className="dashboard-device-info">
              <Link to="/settings/devices">
                <h6>
                  <img src={`${IMAGES}/amphiro_small.svg`} alt="devices" />
                  <span>
                    {
                      (() => {
                        if (deviceCount > 1) { 
                          return `${deviceCount} devices`;
                        } else if (deviceCount === 1) {
                          return '1 device';
                        }
                        return 'No devices';
                      }
                      )()
                    }
                  </span>
                </h6>
              </Link>
              <Link to="/settings/devices">
                <h6>
                  <img src={`${IMAGES}/water-meter.svg`} alt="meters" />
                  <span>
                    {
                      (() => {
                        if (meterCount > 1) { 
                          return `${meterCount} SWMs`;
                        } else if (meterCount === 1) {
                          return '1 SWM';
                        }
                        return 'No SWMs';
                      }
                      )()
                    }
                  </span>
                </h6>
              </Link>
            </div>

            <ButtonToolbar 
              {...{
                switchMode, 
                setDirty, 
                resetDirty, 
                saveToProfile, 
                mode, 
                dirty
              }} 
            />

          </div>
        </div>
      </MainSection>
    );
  }
});

module.exports = Dashboard;
