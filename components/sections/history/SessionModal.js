const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage } = require('react-intl');
const { LineChart } = require('react-echarts');

const SessionDetails = require('./SessionDetails');

const theme = require('../../chart/themes/session');
const { IMAGES } = require('../../../constants/HomeConstants'); 


function Session(props) {
  const { _t, data, chartData, chartCategories, chartFormatter, setSessionFilter, 
    activeDeviceType, activeSessionFilter, sessionFilters, width, period, members } = props;
    
  if (!data) return <div />;
  const { devType, history, id, min, max, date, device, measurements } = data;
  
  const better = data.percentDiff != null ? data.percentDiff < 0 : null;
  const betterStr = better ? 'better' : 'worse';
  let arrowClass;
 
  if (better == null) {
    arrowClass = '';
  } else if (better) {
    arrowClass = 'fa fa-arrow-down green';
  } else {
    arrowClass = 'fa fa-arrow-up red';
  }
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
              <i className={arrowClass} />
              <span>
                {
                  better != null ? 
                    _t(`comparisons.${betterStr}`, {
                      percent: percentDifference,
                      period: _t('section.shower').toLowerCase(), 
                    }) 
                    : 
                   _t('comparisons.no-data')
                }
              </span>
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
            series={[{ name: `${_t('section.shower')} ${id}`, data: chartData, fill: 0.55 }]}
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
              min ? 
                <h5>
                  <i className="fa fa-check green " />&nbsp;&nbsp;
                  <FormattedMessage 
                    id="history.consumption-min" 
                    values={{ period: _t(`periods.${period}`).toLowerCase() }} 
                  />
                </h5>
                :
                <span />
             }
             {
               max ?
                <h5>
                  <img src={`${IMAGES}/warning.svg`} alt="warn" />&nbsp;&nbsp;
                  <FormattedMessage 
                    id="history.consumption-max" 
                    values={{ period: _t(`periods.${period}`).toLowerCase() }} 
                  />
                </h5>
                :
                <span />
            }
            </div>
            <br />
            <div>
              <i className={arrowClass} />
              {
                better != null ? 
                  _t(`comparisons.${betterStr}`, {
                      percent: percentDifference,
                      period, 
                    })
                  : 
                   _t('comparisons.no-data')
              }
            </div>
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
