const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedRelative } = require('react-intl');
const { Responsive, WidthProvider } = require('react-grid-layout');
const { Link } = require('react-router');

const MainSection = require('../layout/MainSection');
const ChartBox = require('../helpers/ChartBox');

const { IMAGES } = require('../../constants/HomeConstants');

const ResponsiveGridLayout = WidthProvider(Responsive);

function ErrorDisplay(props) {
  return props.errors ? 
    <div style={{ zIndex: 100 }}>
      <img src={`${IMAGES}/alert.svg`} alt="error" />
      <span className="infobox-error">{`${props.errors}`}</span>
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

function InfoBox(props) {
  const { infobox, updateInfobox, removeInfobox, intl, linkToHistory } = props;
  const { id, error, period, type, display, periods, time } = infobox;

  const _t = intl.formatMessage;
  return (
    <div className="infobox">
      <div className="infobox-header">
        <div className="header-left">
          <h4>{infobox.title}</h4>
        </div>

        <div className="header-right">
          <div>
            {
              periods.map(p => (
                <a 
                  key={p.id} 
                  onClick={() => updateInfobox(id, { period: p.id, time: p.time })} 
                  style={{ marginLeft: 5 }}
                >
                  {
                    p.id === period ? 
                      <u>{_t({ id: p.title })}</u>
                      :
                       _t({ id: p.title })
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
            // TODO: disable delete infobox until add is created
            <a 
              className="infobox-x" 
              style={{ float: 'right', marginLeft: 5, marginRight: 5 }} 
              onClick={() => removeInfobox(infobox.id)}
            >
              <i className="fa fa-times" />
            </a>
          }
        </div>
      </div>
      
      <div className="infobox-body">
        {
          (() => {
            if (error) {
              return (<ErrorDisplay errors={error} />);
            } 
            if (display === 'stat') {
              return (
                <StatBox {...props} /> 
              );
            } else if (display === 'chart') {
              return (
                <ChartBox {...infobox} /> 
              );
            } else if (display === 'tip') {
              return (
                <TipBox {...props} />
              );
            }
            return <div />;
          }
          )()
         }
      </div>
      <div className="infobox-footer">
        <a onClick={() => linkToHistory(infobox)}>See more</a>
      </div>
    </div>
  );
}

function StatBox(props) {
  const { deviceType, highlight, period, better, comparePercentage, mu } = props.infobox;
  
  //const duration = data?(Array.isArray(data)?null:data.duration):null;
  const arrowClass = better ? 'fa-arrow-down green' : 'fa-arrow-up red';
  const bow = !(better == null || comparePercentage == null);
  const str = better ? 'better' : 'worse';
  return (
    <div>
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
                    <i className={`fa ${arrowClass}`} />
                    {
                      deviceType === 'AMPHIRO' ? 
                        `${comparePercentage}% ${str} than last ${period}!` 
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

function TipBox(props) {
  const { highlight } = props.infobox;
  return (
    <div >
      <p>{highlight}</p>
    </div>
  );
}

function InfoPanel(props) {
  const { mode, layout, infoboxes, updateLayout, updateInfobox, removeInfobox, 
    chartFormatter, intl, periods, displays, linkToHistory } = props;
  return (
    <ResponsiveGridLayout 
      className="layout"
      layouts={{ lg: layout, md: layout, sm: layout }}
      breakpoints={{ lg: 1080, md: 650, sm: 200 }}
      cols={{ lg: 8, md: 4, sm: 2 }}
      rowHeight={160}
      measureBeforeMount
      draggableHandle=".infobox-header"
      resizable
      draggable
      onResizeStop={(newLayout) => { 
        updateLayout(newLayout);  
      }}
      onDragStop={(newLayout) => {
        updateLayout(newLayout); 
      }} 
    >
      {
       infoboxes.map(infobox => (
         <div key={infobox.id}>
           <InfoBox 
             {...{
               mode, 
               periods, 
               displays, 
               chartFormatter, 
               infobox, 
               updateInfobox, 
               removeInfobox, 
               intl, 
               linkToHistory,
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

function AddInfoboxForm(props) {
  const { infoboxToAdd, types, deviceTypes, setForm } = props;
  const setInfoboxToAdd = data => setForm('infoboxToAdd', data);
  const { deviceType, title, type } = infoboxToAdd;
  return (
    <div>
      <bs.Tabs 
        className="history-time-nav" 
        position="top" 
        tabWidth={3} 
        activeKey={deviceType} 
        onSelect={key => setInfoboxToAdd({ 
          deviceType: key, 
          title: null, 
          type: key === 'METER' ? 'totalDifferenceStat' : 'totalVolumeStat'
        })}
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
      <div className="add-infobox">
        <div className="add-infobox-left">
          <div>
            <ul className="add-infobox-types">
              {
                types.map((t, idx) =>
                  <li key={idx}>
                    <a 
                      className={type === t.id ? 'selected' : ''}  
                      onClick={() => setInfoboxToAdd({ type: t.id, title: null })} 
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
        <div className="add-infobox-right">
          <div>
            <input 
              type="text" 
              placeholder="Enter title..."
              value={title || (types.find(t => t.id === type) ? 
                               types.find(t => t.id === type).title : null 
                              )
              }
              onChange={e => setInfoboxToAdd({ title: e.target.value })}
            />
            <p>{ types.find(t => t.id === infoboxToAdd.type) ? 
              types.find(t => t.id === infoboxToAdd.type).description 
                : null 
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddInfoboxModal(props) {
  const { showModal, switchMode, addInfobox, metrics, types, deviceTypes, 
    infoboxToAdd, setForm } = props;
  return (
    <bs.Modal 
      animation={false} 
      className="add-infobox-modal" 
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
        <AddInfoboxForm {...{ infoboxToAdd, metrics, types, deviceTypes, setForm }} /> 
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <a onClick={() => switchMode('normal')}>Cancel</a>
        <a 
          style={{ marginLeft: 20 }} 
          onClick={() => { addInfobox(); switchMode('normal'); }}
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
    //const { fetchAllInfoboxesData, switchMode } = this.props;
    //switchMode("normal");
    //fetchAllInfoboxesData();
  },
  
  render: function () {
    const { firstname, mode, dirty, switchMode, addInfobox, saveToProfile, 
      setDirty, resetDirty, deviceCount, meterCount, metrics, types, 
      deviceTypes, infoboxToAdd, setForm } = this.props;

    return (
      <MainSection id="section.dashboard">
        <div className="dashboard">
          <div className="dashboard-infopanel">
            <SayHello firstname={firstname} />
            <AddInfoboxModal 
              {...{
                showModal: mode === 'add', 
                switchMode, 
                addInfobox, 
                infoboxToAdd,
                metrics, 
                types, 
                deviceTypes, 
                setForm 
              }} 
            />
            <InfoPanel {...this.props} />
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
