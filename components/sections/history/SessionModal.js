const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const { LineChart } = require('react-echarts');

const SessionDetails = require('./SessionDetails');

const theme = require('../../chart/themes/session');
const { IMAGES } = require('../../../constants/HomeConstants'); 

function BetterOrWorse(props) {
  const { better, percentDifference, period, deviceType, _t } = props;
  const devStr = deviceType === 'AMPHIRO' ? 'last-AMPHIRO' : deviceType;
  const betterStr = better ? `better-${devStr}` : `worse-${devStr}`;
  if (better === null) {
    return (
      <div>
        { _t('comparisons.no-data') }
      </div>
    );
  } else if (better) {
    return (
      <div>
        <img 
          src={`${IMAGES}/better.svg`} 
          style={{ height: 25, marginRight: 10 }}
          alt="better" 
        />
      {
        _t(`comparisons.${betterStr}`, {
          percent: percentDifference,
          period, 
        }) 
      }
    </div>
    );
  } 
  return (
    <div>
      <img 
        src={`${IMAGES}/worse.svg`} 
        style={{ height: 25, marginRight: 10 }}
        alt="worse" 
      />
      {
      _t(`comparisons.${betterStr}`, {
        percent: percentDifference,
        period, 
      }) 
    }
  </div>
  );
}

function Session(props) {
  const { _t, data, chartData, chartCategories, chartFormatter, setSessionFilter, 
    activeDeviceType, activeSessionFilter, sessionFilters, width, period, members } = props;
    
  if (!data) return <div />;
  const { devType, history, id, min, max, date, device, measurements } = data;
  
  const better = data.percentDiff != null ? data.percentDiff < 0 : null;
  const betterStr = better ? 'better' : 'worse';

  const percentDifference = data.percentDiff != null ? 
    Math.abs(data.percentDiff) 
    : '';
    
  if (devType === 'AMPHIRO' && (history === true || !measurements || (Array.isArray(measurements) && measurements.length === 0))) {
    return (
      <div className="shower-container">
        <div className="shower-chart-area">
          <div className="limited-data-text">
            <h3><FormattedMessage id="history.limitedData" /></h3>
            <h5>
              <BetterOrWorse 
                deviceType={activeDeviceType}
                better={better} 
                percentDifference={percentDifference}
                _t={_t}
              />
            </h5>
          </div> 
        </div> 

        <SessionDetails
          {...props}
        />
      </div> 
    );
  } else if (devType === 'AMPHIRO') {
    return (
      <div className="shower-container">
        <div className="shower-chart-area">
          <bs.Tabs 
            position="top" 
            tabWidth={10} 
            activeKey={activeSessionFilter} 
            onSelect={(val) => { setSessionFilter(val); }}
          >
            {
              sessionFilters.map(metric => (
                <bs.Tab 
                  key={metric.id} 
                  eventKey={metric.id} 
                  title={_t(metric.title)} 
                /> 
              ))
            }
          </bs.Tabs> 
          <LineChart
            height={300}
            width={width} 
            theme={theme}
            xAxis={{
              data: chartCategories,
              boundaryGap: true,
            }}
            yAxis={{
              min: 0,
              formatter: chartFormatter,
            }} 
            series={[{ 
              name: `${_t('section.shower')} ${id}`, 
              data: chartData, 
              fill: 0.55,
            }]}
          />
        </div>
          
        <SessionDetails
          {...props}
        /> 
      </div>
    );
  }
  return (
    <div className="shower-container">
      <div className="meter-chart-area">
        <div className="limited-data-text">
          <h4>
            <div> 
            {
              (() => {
                if (min) {
                 return ( 
                    <h5>
                      <i className="fa fa-check green " />&nbsp;&nbsp;
                      <FormattedMessage 
                        id="history.consumption-min" 
                        values={{ period: _t(`periods.${period}`).toLowerCase() }} 
                      />
                    </h5>
                    );
                } else if (max) {
                  return (
                    <h5>
                      <img src={`${IMAGES}/warning.svg`} alt="warn" />&nbsp;&nbsp;
                      <FormattedMessage 
                        id="history.consumption-max" 
                        values={{ period: _t(`periods.${period}`).toLowerCase() }} 
                      />
                    </h5>
                    );
                }
                return <span />;
            }
              )()
            }
            </div>
            <br />
            
            <BetterOrWorse 
              deviceType={activeDeviceType}
              better={better} 
              percentDifference={percentDifference}
              period={_t(`comparisons.${period}`)}
              _t={_t}
            />
          </h4>
        </div>
      </div>
      
      <SessionDetails
        {...props}
      />
    </div> 
  );
}

const SessionModal = React.createClass({
  onClose: function () {
    this.props.resetActiveSession();
    this.props.disableEditShower();
  },
  onNext: function () {
    const { next: [device, id, timestamp] } = this.props.data;
    this.props.setActiveSession(device, id, timestamp);
  },
  onPrevious: function () {
    const { prev: [device, id, timestamp] } = this.props.data;
    this.props.setActiveSession(device, id, timestamp);
  },
  render: function () {
    const { data, activeDeviceType } = this.props;
    if (!data) return <div />;
    const { next, prev } = data;
    const disabledNext = !Array.isArray(next);
    const disabledPrevious = !Array.isArray(prev);
    return (
      <bs.Modal 
        animation={false} 
        show={this.props.showModal} 
        onHide={this.onClose} 
        dialogClassName={activeDeviceType === 'AMPHIRO' ? 
          'shower-modal' 
           : 
          'session-modal'
        }
        bsSize="large"
        onKeyDown={(e) => { 
          if (e.keyCode === 39 && !disabledNext) {
            this.onNext();
          } else if (e.keyCode === 37 && !disabledPrevious) {
            this.onPrevious();
          } 
        }}
      >
        <bs.Modal.Header closeButton>
          <bs.Modal.Title>
            {
              data.id ?
                <span>
                  <div>
                    <img src={`${IMAGES}/shower.svg`} alt="shower" />
                    &nbsp;&nbsp;
                    <FormattedMessage id="section.shower" />
                    <span>{` #${data.id}`}</span>
                  </div>
                </span>
                :
                <FormattedMessage id="section.shower-aggregated" />
            }
          </bs.Modal.Title>
        </bs.Modal.Header>
        <bs.Modal.Body>
          <div ref={(el) => { this.el = el; }}>
            <Session {...this.props} width={this.el ? this.el.clientWidth : '100%'} />
          </div>
        </bs.Modal.Body>
        <bs.Modal.Footer>
          { 
            disabledPrevious ? 
              <span /> 
              : 
              <button 
                className="btn-a pull-left" 
                onClick={this.onPrevious}
              >
              <FormattedMessage id="forms.previous" />
            </button> 
         }
         { 
           disabledNext ? 
             <span /> 
             : 
             <button 
               className="btn-a pull-right" 
               onClick={this.onNext}
             >
              <FormattedMessage id="forms.next" />
            </button> 
         }
        </bs.Modal.Footer>
      </bs.Modal> 
    );
  }
});
    
module.exports = SessionModal;
