const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedTime, FormattedDate } = require('react-intl');
const DatetimeInput = require('react-datetime');

const { LineChart } = require('react-echarts');
const theme = require('../chart/themes/session');
const { volumeToPictures, energyToPictures } = require('../../utils/sessions'); 
const { SHOWER_METRICS, METER_AGG_METRICS, IMAGES } = require('../../constants/HomeConstants'); 


function Picture(props) {
  const { display, items, metric, remaining, iconSuffix = '', _t } = props;
  return (
    <img 
      src={`${IMAGES}/${display}${iconSuffix}.svg`} 
      className={['picture', display].join(' ')}
      title={_t('history.inPicturesHover',
        {
          number: items, 
          metric: _t(`common.${metric}`),
          scale: _t(`history.${display}`),
        })
      }
      alt={display}
    />
  );
}

function InPictures(props) {
  const { display, items, remaining, metric } = props;
  return (
    <div className="in-pictures">
      {
        Array.from({ length: items }).map((v, i) => (
          <Picture {...props} />
          ))
      }
      {(() => {
        if (remaining === 0.25) {
          return <Picture {...props} iconSuffix="-25" />;
        } else if (remaining === 0.5) {
          return <Picture {...props} iconSuffix="-50" />;
        } else if (remaining === 0.75) {
          return <Picture {...props} iconSuffix="-75" />;
        }
        return <i />;
      })()
      }
    </div>
  );
}

function SessionInfoLine(props) {
  const { id, name, title, icon, data, mu, _t } = props;
  return !data ? <div /> : (
  <li className="session-item" >
    <span>
      <h4 style={{ float: 'left' }}>
        <img 
          style={{ 
            height: id === 'temperature' ? 30 : 24, 
            marginLeft: id === 'temperature' ? 7 : 0, 
            marginRight: 20,
          }} 
          src={`${IMAGES}/${icon}`} 
          alt={name} 
        /> 
        <FormattedMessage id={title} />
      </h4>
      {
        (() => {
          if (id === 'difference' || id === 'volume') {
            return <InPictures {...{ ...volumeToPictures(data), metric: id, _t }} />;
          } else if (id === 'energy') {
            return <InPictures {...{ ...energyToPictures(data), metric: id, _t }} />;
          }
          return <span />;
        })()
      }
      <h4 style={{ float: 'right' }}>{data} <span>{mu}</span></h4>
    </span>
  </li>
  );
}
      

function Member(props) {
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

function SessionInfo(props) {
  const { _t, data, activeDeviceType, members, editShower, setSessionFilter, assignToMember, enableEditShower, disableEditShower, ignoreShower, memberFilter, fetchAndSetQuery, nextReal, setShowerReal, setShowerTimeForm, showerTime } = props; 
  const { device: deviceKey, id: sessionId, member, history } = data;

  const metrics = activeDeviceType === 'METER' ? METER_AGG_METRICS : SHOWER_METRICS;

  return !data ? <div /> : (
    <div className="shower-info">  
      {
        editShower ?
          <div className="ignore-shower">
            <a 
              onClick={() => ignoreShower({ 
                deviceKey, 
                sessionId, 
              })
              .then(() => fetchAndSetQuery({ active: [deviceKey, sessionId] })) 
              .then(() => disableEditShower())
              }
            >
              Delete shower
            </a>
          </div>
          :
          <span />
        }
      <div className="headline"> 
        <div className="edit-shower-control">
        {
          editShower ? 
            <a onClick={disableEditShower}><i className="fa fa-times" /></a>
            :
            <a onClick={enableEditShower}><i className="fa fa-pencil" /></a>
        }
      </div> 

      <Member 
        {...{ 
          deviceKey, 
          sessionId, 
          member, 
          memberFilter,
          members, 
          assignToMember, 
          editShower, 
          enableEditShower, 
          disableEditShower,
          fetchAndSetQuery,
        }} 
      /> 
      
      {
        activeDeviceType === 'AMPHIRO' ? 
          <span className="headline-date">
            <i className="fa fa-calendar" />
            { 
              editShower && history ? 
                <span>
                  <DatetimeInput
                    dateFormat="DD/MM/YYYY"
                    timeFormat="HH:mm"
                    className="headline-date-input"
                    inputProps={{ size: 18 }}
                    value={showerTime} 
                    isValidDate={curr => nextReal ? 
                      curr.valueOf() <= nextReal.timestamp 
                      : 
                      curr.valueOf() <= new Date().valueOf()
                    }
                    isValidTime={curr => nextReal ? 
                      curr.valueOf() <= nextReal.timestamp 
                      : 
                      curr.valueOf() <= new Date().valueOf()
                    }
                    onChange={(val) => {
                      setShowerTimeForm(val.valueOf());
                    }}
                  /> 
                  &nbsp;
                  <a 
                    onClick={() => setShowerReal({ 
                      deviceKey, 
                      sessionId,
                      timestamp: showerTime,
                    })
                    .then(() => fetchAndSetQuery({ active: [deviceKey, sessionId] })) 
                    .then(() => disableEditShower())
                    }
                  >
                    Set
                  </a>
                </span>
                :
                <span>
                  <FormattedDate 
                    value={new Date(data.timestamp)} 
                    year="numeric" 
                    month="long" 
                    day="numeric" 
                    weekday="long" 
                  /> 
                  &nbsp;
                  <FormattedTime value={new Date(data.timestamp)} />
                </span>
            }
          </span> 
          :
          <span className="headline-date">
            <i className="fa fa-calendar" />
            {data.date}
          </span>
      }
    </div> 
    <br />
    <ul className="sessions-list" >
      {
        metrics.map(metric => (
          <SessionInfoLine
            key={metric.id} 
            _t={_t}
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
  const { _t, data, chartData, chartCategories, chartFormatter, setSessionFilter, 
    activeDeviceType, activeSessionFilter, sessionFilters, width, mu, period, members } = props;
    
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
    ` ${Math.abs(data.percentDiff)}%` 
    : '';
    
  if (devType === 'AMPHIRO' && (history === true || (Array.isArray(measurements) && measurements.length === 0))) {
    return (
      <div className="shower-container">
        <div className="shower-chart-area">
          <div className="limited-data-text">
            <h3><FormattedMessage id="history.limitedData" /></h3>
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
        </div> 

        <SessionInfo
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
              formatter: y => `${y} ${mu}`,
            }} 
            series={[{ name: `${_t('section.shower')} ${id}`, data: chartData, fill: 0.55 }]}
          />
        </div>
          
        <SessionInfo
          {...props}
        /> 
      </div>
    );
  }
  return (
    <div className="shower-container">
      <div className="shower-chart-area">
        <div className="limited-data-text">
          <h4>
            <div> 
            {
              min ? 
                <h5>
                  <i className="fa fa-check green " />&nbsp;&nbsp;
                  <span>{_t(`periods.${period}`) + ' with minimum consumption. Well done!'}</span>
                </h5>
                :
                <span />
             }
             {
               max ?
                <h5>
                  <img src={`${IMAGES}/warning.svg`} alt="warn" />&nbsp;&nbsp;
                  <span>{_t(`periods.${period}`) + ' with maximum consumption'}</span>
                </h5>
                :
                <span />
            }
            </div>
            <br />
            <div>
              <i className={arrowClass} />
              <b>{percentDifference}</b>
              {
                better != null ? 
                  `  ${betterStr} than last measurement!` 
                  : 
                    'No comparison data'
              }
            </div>
          </h4>
        </div>
      </div>
      
      <SessionInfo
        {...props}
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
    return (
      <bs.Modal 
        animation={false} 
        show={this.props.showModal} 
        onHide={this.onClose} 
        dialogClassName="session-modal"
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
                  { 
                    data.ignored ? 
                      <span>Not a shower!</span>
                      :
                        <div>
                          <FormattedMessage id="section.shower" />
                          <span>{` ${data.id}`}</span>
                        </div>
                  }
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
