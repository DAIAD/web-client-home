const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedRelative } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../../layout/MainSection');
const AddWidgetModal = require('./AddWidget');
const WidgetPanel = require('./WidgetPanel');
const SayHello = require('./SayHello');

const { IMAGES } = require('../../../constants/HomeConstants');

const Dashboard = React.createClass({
  //mixins: [ PureRenderMixin ],

  componentWillMount: function () {
    this.props.widgets.forEach((widget) => {
      if (widget.synced === false) {
        this.props.fetchWidgetData(widget.id);
      }
    });
  },
  
  render: function () {
    const { firstname, mode, dirty, switchMode, addWidget, saveToProfile, 
      setDirty, resetDirty, deviceCount, meterCount, metrics, widgetTypes, 
      deviceTypes, widgetToAdd, setForm, activeDeviceType, setDeviceType, 
      setWidgetToAdd, resetWidgetToAdd, _t } = this.props;
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
                resetWidgetToAdd,
                _t,
              }} 
            />

            <WidgetPanel {...this.props} />

          </div>
          <div className="dashboard-right">
            <div className="dashboard-device-info">
              <Link to="/settings/devices">
                <h6>
                  {
                    (() => {
                      if (deviceCount > 1) { 
                        return (
                          <span>
                          <img src={`${IMAGES}/amphiro_small.svg`} alt="devices" />
                          {deviceCount} <FormattedMessage id="devices.amphiros" />
                        </span>
                        );
                      } else if (deviceCount === 1) {
                        return (
                          <span>
                          <img src={`${IMAGES}/amphiro_small.svg`} alt="devices" />
                            1 <FormattedMessage id="devices.amphiro" />
                          </span>
                          );
                      }
                      return <span />;
                    }
                    )()
                  }
                </h6>
              </Link>
              <Link to="/settings/devices">
                <h6>
                  {
                    (() => {
                      if (meterCount > 1) { 
                        return (
                          <span>
                          <img src={`${IMAGES}/water-meter.svg`} alt="meters" />
                          {meterCount} <FormattedMessage id="devices.meters" />
                        </span>
                        );
                      } else if (meterCount === 1) {
                        return (
                          <span>
                          <img src={`${IMAGES}/water-meter.svg`} alt="meters" />
                          1 <FormattedMessage id="devices.meter" />
                        </span>
                        );
                      }
                      return <span />;
                    }
                    )()
                  }
                </h6>
              </Link>
            </div>
            
            <div className="dashboard-button-toolbar">
              <button
                className="btn dashboard-add-btn" 
                onClick={() => switchMode('add')} 
                active={false}
              >
                <FormattedMessage id="dashboard.add" />
              </button>
              {
                dirty ? 
                  <div className="dashboard-save">
                    <img src={`${IMAGES}/info.svg`} alt="info" style={{ float: 'left', width: 22 }} />
                    <h6><FormattedMessage id="dashboard.save" /></h6>
                    <div className="dashboard-save-prompt">
                      <button 
                        className="btn dashboard-save-btn" 
                        onClick={() => {
                          saveToProfile()
                          .then(() => resetDirty());
                        }} 
                        active={false}
                      >
                        <FormattedMessage id="forms.yes" />
                      </button>
                      <button 
                        className="btn dashboard-discard-btn" 
                        onClick={() => resetDirty()} 
                        active={false}
                      >
                        <FormattedMessage id="forms.no" />
                      </button>
                    </div>
                  </div>
                  :
                  <div />
              }
            </div>
          </div>
        </div>
      </MainSection>
    );
  }
});

module.exports = Dashboard;
