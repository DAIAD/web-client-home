const React = require('react');
const { FormattedDate } = require('react-intl');
const bs = require('react-bootstrap');
const CheckboxGroup = require('react-checkbox-group');
const DatetimeInput = require('react-datetime');

const MainSection = require('../layout/MainSection');
const Topbar = require('../layout/Topbar');
const { SidebarLeft, SidebarRight } = require('../layout/Sidebars');
const HistoryList = require('../SessionsList');

//sub-containers
const SessionData = require('../../containers/SessionData');
const HistoryChartData = require('../../containers/HistoryChartData');

//utils
const timeUtil = require('../../utils/time');
const { IMAGES } = require('../../constants/HomeConstants');


function CustomTimeNavigator(props) {
  const { time, updateTime } = props;
  return (
    <div className="time-navigator">
      <div className="time-navigator-child"> 
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
    <div className="time-navigator">
      <a className="time-navigator-child pull-left" onClick={handlePrevious}>
        <img src={`${IMAGES}/arrow-big-left.svg`} alt="previous" />
      </a>
      <div className="time-navigator-child">
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
      <a className="time-navigator-child pull-right" onClick={handleNext}>
        <img src={`${IMAGES}/arrow-big-right.svg`} alt="next" />
      </a>
    </div>
  );
}


const History = React.createClass({

  componentWillMount: function () {

  },
  handleTypeSelect: function (key) {
    this.props.setMetricFilter(key); 
  },
  handlePeriodSelect: function (key) {
    let time = null;
    if (key === 'always') {
      time = {
        startDate: new Date('2000-02-18').getTime(),
        endDate: new Date('2016-12-31').getTime(),
        granularity: 0,
      };
    } else if (key === 'year') {
      time = timeUtil.thisYear();
    } else if (key === 'month') {
      time = timeUtil.thisMonth();
    } else if (key === 'week') {
      time = timeUtil.thisWeek();
    } else if (key === 'day') {
      time = timeUtil.today();
    } else {
      //throw new Error('oops, shouldn\'t be here');
    }

    this.props.setTimeFilter(key);

    if (time) this.props.setTime(time, false);
    this.props.fetchData();
  },
  handlePrevious: function () { 
    this.props.setTime(this.props.previousPeriod);
  },
  handleNext: function () { 
    this.props.setTime(this.props.nextPeriod);
  },
  handleDeviceChange: function (val) {
    const mapped = val.map(d => d.value); 
    this.props.setActiveDevice(mapped);
  },
  handleDeviceTypeSelect: function (val) {
    this.props.setActiveDeviceType(val);
  },
  handleActiveDevicesChanged: function (vals) {
    if (this.props.activeDeviceType === 'METER') { 
      this.props.setActiveDeviceType('AMPHIRO', false);
    }
    this.props.setActiveDevice(vals);
  },
  handleComparisonSelect: function (val) {
    this.props.setComparison(val); 
  },
  handleSortSelect: function (e, val) {
    this.props.setSortFilter(val);
  },
  render: function () {
    const { intl, amphiros, activeDevice, activeDeviceType, timeFilter, 
      time, metrics, periods, comparisons, deviceTypes } = this.props;
    const _t = intl.formatMessage;

    if (this.props.lala) {
      return <span>HISTORY IS GREAT</span>;
    }
    return (
      <MainSection id="section.history">
        <Topbar> 
          <bs.Tabs 
            className="history-time-nav" 
            position="top" 
            tabWidth={3} 
            activeKey={timeFilter} 
            onSelect={this.handlePeriodSelect}
          >
            {
              periods.map(period => (
                <bs.Tab 
                  key={period.id} 
                  eventKey={period.id} 
                  title={_t({ id: period.title })} 
                />
              ))
            } 
          </bs.Tabs>
        </Topbar>
        <div className="section-row-container">
          <SidebarLeft> 
            <bs.Tabs 
              position="left" 
              tabWidth={20} 
              activeKey={this.props.metricFilter} 
              onSelect={this.handleTypeSelect}
            >
              {
                metrics.map(metric => (
                  <bs.Tab 
                    key={metric.id} 
                    eventKey={metric.id} 
                    title={metric.title} 
                  /> 
                ))
              }
            </bs.Tabs>
          </SidebarLeft>
          <SidebarRight> 
            {
              <bs.Tabs 
                position="left" 
                tabWidth={20} 
                activeKey={this.props.activeDeviceType} 
                onSelect={this.handleDeviceTypeSelect}
              >
                {
                 deviceTypes.map(devType => ( 
                   <bs.Tab 
                     key={devType.id} 
                     eventKey={devType.id} 
                     title={devType.title} 
                   /> 
                 ))
                }
              </bs.Tabs>
            }
            <CheckboxGroup 
              name="amphiro-devices" 
              className="amphiro-devices" 
              value={activeDeviceType === 'AMPHIRO' ? 
                activeDevice
                : []} 
              onChange={this.handleActiveDevicesChanged}
            >
              {
                Checkbox => (
                  <div>
                    {
                      amphiros.map(device => (
                        <label key={device.deviceKey} htmlFor={device.deviceKey}>
                          <Checkbox 
                            id={device.deviceKey} 
                            value={device.deviceKey} 
                          /> 
                          {device.name || device.macAddress || device.serial}
                        </label>
                        ))
                    }
                  </div>
                  )
              }
            </CheckboxGroup>
            <br />
            { 
              comparisons && comparisons.length > 0 ?
                <h5 style={{ marginLeft: 20 }}>Compare with</h5>
                :
                <span />
            }
            {
              <bs.Tabs 
                position="left" 
                tabWidth={20} 
                activeKey={this.props.comparison} 
                onSelect={this.handleComparisonSelect}
              >
                {
                  comparisons.map(comparison => 
                    <bs.Tab 
                      key={comparison.id} 
                      eventKey={comparison.id} 
                      title={comparison.title} 
                    />
                    )
                }
              </bs.Tabs>
            }
            {
              this.props.comparison ?
                <a 
                  style={{ marginLeft: 20, marginTop: 20 }} 
                  onClick={() => this.props.setComparison(null)}
                >
                  Clear
                </a>
                :
                <div />
            }
          </SidebarRight>
          <div className="primary"> 
            <div className="history-chart-area">
              <h4 style={{ textAlign: 'center', margin: '10px 0 0 0' }}>
                {this.props.reducedMetric}
              </h4>
              { 
                (() => {
                  if (activeDeviceType === 'METER') {
                    if (timeFilter === 'custom') { 
                      return (
                        <CustomTimeNavigator 
                          updateTime={this.props.updateTime}
                          time={time}
                        />
                      );
                    }
                    return (
                      <TimeNavigator 
                        handlePrevious={this.handlePrevious} 
                        handleNext={this.handleNext}
                        time={time}
                      />
                    );
                  }
                  return <div />;
                })()
              }
              <div className="history-chart">
                <HistoryChartData />
              </div>
              
            </div>        
            <HistoryList 
              handleSortSelect={this.handleSortSelect}
              activeDeviceType={activeDeviceType}
              {...this.props} 
            />
          </div>
        </div>
        <SessionData 
          firstname={this.props.firstname}
          sessions={this.props.sessions} 
          time={this.props.time} 
        />
      </MainSection>
    );
  }
});

module.exports = History;
