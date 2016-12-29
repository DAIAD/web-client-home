const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedTime, FormattedDate } = require('react-intl');

const { LineChart } = require('react-echarts');
const theme = require('./chart/themes/line');

const { SHOWER_METRICS, METER_AGG_METRICS, IMAGES } = require('../constants/HomeConstants'); 

function SessionInfoItem(props) {
  const _t = props.intl.formatMessage;
  return !props.data ? <div /> : (
  <li className="session-item" >
    {
      props.sessionClick ?
        <a 
          onClick={() => props.sessionClick(props.id)} 
          title={_t({ id: props.details })}
        >
          <h4 style={{ float: 'left' }}>
            <img
              style={{ 
                height: props.id === 'temperature' ? 30 : 24, 
                marginLeft: props.id === 'temperature' ? 7 : 0,
                marginRight: 20
              }} 
              src={`${IMAGES}/${props.icon}`}
              alt={props.name}
            />
            <FormattedMessage id={props.title} />
          </h4>
          <h4 style={{ float: 'right' }}>{props.data} <span>{props.mu}</span></h4>
        </a>
      :
      <span>
        <h4 style={{ float: 'left' }}>
          <img 
            style={{ 
              height: props.id === 'temperature' ? 30 : 24, 
              marginLeft: props.id === 'temperature' ? 7 : 0, 
              marginRight: 20,
            }} 
            src={`${IMAGES}/${props.icon}`} 
            alt={props.name} 
          />
          <FormattedMessage id={props.title} />
        </h4>
        <h4 style={{ float: 'right' }}>{props.data} <span>{props.mu}</span></h4>
      </span>
    }
  </li>
  );
}

function SessionInfo(props) {
  const { setSessionFilter, intl, data, firstname, activeDeviceType } = props;
  const metrics = activeDeviceType === 'METER' ? METER_AGG_METRICS : SHOWER_METRICS;
   
  return !data ? <div /> : (
  <div className="shower-info">
    <div className="headline">
      <span className="headline-user">
        <i className="fa fa-user" />
        {firstname}
      </span>
      {
        activeDeviceType === 'AMPHIRO' ? 
          <span className="headline-date">
            <i className="fa fa-calendar" />
            <FormattedDate 
              value={new Date(data.timestamp)} 
              year="numeric" 
              month="long" 
              day="numeric" 
              weekday="long" 
            /> 
            <FormattedTime value={new Date(data.timestamp)} />
          </span> 
          :
          <span className="headline-date">
            <i className="fa fa-calendar" />
            {data.date}
          </span>
      }
    </div>
    <ul className="sessions-list" >
      {
        metrics.map(metric => (
          <SessionInfoItem 
            key={metric.id} 
            intl={intl} 
            icon={metric.icon} 
            sessionClick={metric.clickable ? setSessionFilter : null} 
            title={metric.title} 
            id={metric.id} 
            data={data[metric.id]} 
            mu={metric.mu} 
            details={metric.details} 
          />
        ))
      }
    </ul>
  </div>
  );
}

function Session(props) {
  const { intl, data, chartData, chartCategories, chartFormatter, setSessionFilter, 
    firstname, activeDeviceType, width } = props;
    
  if (!data) return <div />;
  const { history, id } = data;
  const _t = x => intl.formatMessage({ id: x });
  
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
    ` ${Math.abs(data.percentDiff)}%` 
    : '';

  if (!history) {
    return (
      <div className="shower-container">
        <div className="shower-chart-area">
          <LineChart
            height={300}
            width={width} 
            theme={theme}
            xAxis={{
              data: chartCategories,
              boundaryGap: true,
            }}
            yAxis={{
              formatter: y => `${y} lt`,
            }}
            grid={{
              x: 50,
              x2: 50,
              y: -30,
              y2: 30,
            }}
            series={[{ name: `${_t('section.shower')} #${id}`, data: chartData, fill: 0.55 }]}
          />
        </div>
          
        <SessionInfo
          firstname={firstname}
          intl={intl}
          setSessionFilter={setSessionFilter}
          activeDeviceType={activeDeviceType}
          data={data} 
        /> 
      </div>
    );
  } else if (history) {
    return (
      <div className="shower-container">
        <div className="shower-chart-area">
          <h3><FormattedMessage id="history.limitedData" /></h3>
        </div>

        <div style={{ marginTop: 10 }}>
          <h5>
            <i className={arrowClass} />
            <b>{percentDifference}</b>
            <span>
              {
                better != null ? 
                  `  ${betterStr} than last shower`
                  : 
                 'No comparison data'
              }
            </span>
          </h5>
        </div> 

        <SessionInfo
          firstname={firstname}
          activeDeviceType={activeDeviceType}
          intl={intl}
          data={data} 
        />
      </div> 
    );
  }
  return (
    <div className="shower-container">
      <div className="shower-chart-area">
        <h4>
          <i className={arrowClass} />
          <b>{percentDifference}</b>
          <span>
            {
              better != null ? 
                `  ${betterStr} than last measurement!` 
                : 
                'No comparison data'}
          </span>
        </h4>
      </div>
      
      <SessionInfo
        firstname={firstname}
        activeDeviceType={activeDeviceType}
        intl={intl}
        data={data} 
      />
    </div> 
  );
}

const SessionModal = React.createClass({
  onClose: function () {
    this.props.resetActiveSession();
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
    const { data } = this.props;
    if (!data) return <div />;
    const { next, prev } = data;
    const disabledNext = !Array.isArray(next);
    const disabledPrevious = !Array.isArray(prev);
    //const _t = intl.formatMessage;
    return (
      <bs.Modal 
        animation={false} 
        show={this.props.showModal} 
        onHide={this.onClose} 
        bsSize="large"
      >
        <bs.Modal.Header closeButton>
          <bs.Modal.Title>
            {
              data.id ?
                <span>
                  <span>{` ${data.devName}  `}</span>
                  <FormattedMessage id="section.shower" />
                  <span>{` #${data.id}`}</span>
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
          { disabledPrevious ? <span /> : <a className="pull-left" onClick={this.onPrevious}>Previous</a> }
          { disabledNext ? <span /> : <a className="pull-right" onClick={this.onNext}>Next</a> }
        </bs.Modal.Footer>
      </bs.Modal> 
    );
  }
});
    
module.exports = SessionModal;
