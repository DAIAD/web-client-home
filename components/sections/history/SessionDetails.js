const React = require('react');
const bs = require('react-bootstrap');
const { FormattedMessage, FormattedTime, FormattedDate } = require('react-intl');
const DatetimeInput = require('react-datetime');

const ShowerMember = require('./ShowerMember');
const InPictures = require('./InPictures');

const { volumeToPictures, energyToPictures, getMetricMu } = require('../../../utils/general'); 

const { IMAGES } = require('../../../constants/HomeConstants'); 

function SessionDetailsLine(props) {
  const { id, name, title, icon, data, _t } = props;
  return data == null ? <div /> : (
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
      <h4 style={{ float: 'right' }}>{data} <span>{getMetricMu(id)}</span></h4>
    </span>
  </li>
  );
}
      

function SessionDetails(props) {
  const { _t, data, activeDeviceType, members, editShower, setSessionFilter, assignToMember, enableEditShower, disableEditShower, ignoreShower, memberFilter, fetchAndSetQuery, nextReal, setShowerReal, setShowerTimeForm, showerTime, metrics } = props; 
  const { device: deviceKey, id: sessionId, member, history } = data;

  return !data ? <div /> : (
    <div className="shower-info">  
      {
        activeDeviceType === 'AMPHIRO' && editShower ?
          <div className="ignore-shower">
            <button
              className="btn-a" 
              onClick={() => ignoreShower({ 
                deviceKey, 
                sessionId, 
              })
              .then(() => fetchAndSetQuery({ active: [deviceKey, sessionId] })) 
              .then(() => disableEditShower())
              }
            >
              <FormattedMessage id="history.shower-delete" />
            </button>
          </div>
          :
          <span />
        }
      <div className="headline">  
      {
        activeDeviceType === 'AMPHIRO' ? 
          <div className="headline-date">
            <i className="fa fa-calendar" />
            { 
              editShower && history ? 
                <div className="headline-date-wrapper">
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
                  <button
                    className="btn-a"  
                    onClick={() => setShowerReal({ 
                      deviceKey, 
                      sessionId,
                      timestamp: showerTime,
                    })
                    .then(() => fetchAndSetQuery({ active: [deviceKey, sessionId] })) 
                    .then(() => disableEditShower())
                    }
                  >
                   <FormattedMessage id="forms.set" />
                  </button>
                </div>
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
          </div> 
          :
          <span className="headline-date">
            <i className="fa fa-calendar" />
            {data.date}
          </span>
      }
      { 
       activeDeviceType === 'AMPHIRO' ?
          <div className="edit-shower-control">
          {
             editShower ? 
               <button 
                 className="btn-a"  
                 onClick={disableEditShower}
               >
                <i className="fa fa-times" />
              </button>
              :
              <button
                className="btn-a"  
                onClick={enableEditShower}
              >
                <i className="fa fa-pencil" />
              </button>
          }
        </div> 
        :
          <span />
      }
          
        <ShowerMember 
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
    </div> 
    <ul className="sessions-list" >
      {
        metrics.map(metric => (
          <SessionDetailsLine
            key={metric.id} 
            _t={_t}
            icon={metric.icon} 
            title={metric.title} 
            id={metric.id} 
            data={data[metric.id]} 
            details={metric.details} 
          />
        ))
      }
    </ul> 
  </div>
  );
}

module.exports = SessionDetails;
