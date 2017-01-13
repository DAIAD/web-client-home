const React = require('react');
const { FormattedDate } = require('react-intl');
const bs = require('react-bootstrap');
const CheckboxGroup = require('react-checkbox-group');
const DatetimeInput = require('react-datetime');

const MainSection = require('../layout/MainSection');
const Topbar = require('../layout/Topbar');
const { SidebarLeft, SidebarRight } = require('../layout/Sidebars');
const Table = require('../helpers/Table');
const { TimeNavigator, CustomTimeNavigator } = require('../helpers/Navigators');

//sub-containers
const SessionData = require('../../containers/SessionData');
const HistoryChartData = require('../../containers/HistoryChartData');

//utils
const timeUtil = require('../../utils/time');
const { IMAGES } = require('../../constants/HomeConstants');

function SessionsList(props) {
  const { sortOptions, sortFilter, sortOrder, handleSortSelect, activeDeviceType, 
    csvData, time, sessionFields, sessions, setActiveSession, setSortOrder, setSortFilter } = props;
    
  const onSessionClick = session => 
    setActiveSession(session.device, session.id, session.timestamp);
  return (
    <div className="history-list-area">
      <div className="history-list-header">
        <h3 style={{ float: 'left' }}>In detail</h3>

        { 
          csvData ?  
            <a 
              style={{ float: 'left', marginLeft: 10 }} 
              className="btn" 
              href={`data:application/csv;charset=utf-8, ${csvData}`}
              download="Data.csv"
            >
              Download
            </a>
           :
           <span />
        }
        <div style={{ float: 'right' }}> 
          <h5 style={{ float: 'left', marginTop: 5 }}>Sort by:</h5>
          <div 
            className="sort-options" 
            style={{ float: 'right', marginLeft: 10, textAlign: 'right' }}
          >
            <bs.DropdownButton
              title={sortOptions.find(sort => sort.id === sortFilter) ? 
                sortOptions.find(sort => sort.id === sortFilter).title
                : 'Volume'}
              id="sort-by"
              defaultValue={sortFilter}
              onSelect={handleSortSelect}
            >
              {
                sortOptions.map(sort => 
                  <bs.MenuItem 
                    key={sort.id} 
                    eventKey={sort.id} 
                    value={sort.id}
                  >
                    {sort.title}
                  </bs.MenuItem>
                )
              } 
            </bs.DropdownButton>

            <div style={{ float: 'right', marginLeft: 10 }}>
              {
                sortOrder === 'asc' ? 
                  <a onClick={() => setSortOrder('desc')}>
                    <i className="fa fa-arrow-down" />
                  </a>
                 :
                 <a onClick={() => setSortOrder('asc')}>
                   <i className="fa fa-arrow-up" />
                 </a>
              }
            </div>
          </div>
        </div>
      </div>
      
      <Table
        className="session-list"
        rowClassName="session-list-item"
        fields={sessionFields}
        data={sessions}
        onRowClick={onSessionClick}
      />
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
    this.props.setTimeFilter(key);

    const time = timeUtil.getTimeByPeriod(key);
    if (time) this.props.setTime(time, true);
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
                  <div className="shower-devices">
                    {
                      amphiros.map(device => (
                        <label key={device.deviceKey} htmlFor={device.deviceKey}>
                          <Checkbox 
                            id={device.deviceKey} 
                            value={device.deviceKey} 
                          /> 
                          <label htmlFor={device.deviceKey} />
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

            <SessionsList 
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
