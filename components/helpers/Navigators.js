const React = require('react');
const DatetimeInput = require('react-datetime');
const { FormattedMessage, FormattedDate } = require('react-intl');

const { IMAGES } = require('../../constants/HomeConstants');

function CustomTimeNavigator(props) {
  const { time, updateTime } = props;
  return (
    <div className="navigator">
      <div className="navigator-child"> 
        <div style={{ float: 'left', marginRight: 5 }}>
          <DatetimeInput
            dateFormat="DD/MM/YYYY"
            timeFormat="HH:mm"
            inputProps={{ size: 18 }}
            value={time.startDate} 
            isValidDate={curr => curr.valueOf() <= time.endDate}
            onChange={val => updateTime({ startDate: val.valueOf() })}
          /> 
        </div>
        - 
        <div style={{ float: 'right', marginLeft: 5 }}>
          <DatetimeInput 
            closeOnSelect
            dateFormat="DD/MM/YYYY"
            timeFormat="HH:mm"
            inputProps={{ size: 18 }}
            value={time.endDate} 
            isValidDate={curr => curr.valueOf() >= time.startDate}
            onChange={val => updateTime({ endDate: val.valueOf() })}
          />
        </div>
      </div>
    </div>
  ); 
}

function TimeNavigator(props) {
  const { time, handlePrevious, handleNext } = props;

  if (!time.startDate || !time.endDate) return (<div />);
  return (
    <div className="navigator">
      <a className="navigator-child pull-left" onClick={handlePrevious}>
        <img src={`${IMAGES}/arrow-big-left.svg`} alt="previous" />
      </a>
      <div className="navigator-child">
        <FormattedDate 
          value={time.startDate} 
          day="numeric" 
          month="long" 
          year="numeric"
        />
        - 
        <FormattedDate 
          value={time.endDate} 
          day="numeric" 
          month="long" 
          year="numeric" 
        />
      </div>
      <a className="navigator-child pull-right" onClick={handleNext}>
        <img src={`${IMAGES}/arrow-big-right.svg`} alt="next" />
      </a>
    </div>
  );
}

module.exports = {
  TimeNavigator,
  CustomTimeNavigator,
};
