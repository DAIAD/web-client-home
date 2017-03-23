const React = require('react');
const { FormattedDate } = require('react-intl');
const bs = require('react-bootstrap');
const CheckboxGroup = require('react-checkbox-group');

const MainSection = require('../layout/MainSection');
const Topbar = require('../layout/Topbar');
const { SidebarLeft, SidebarRight } = require('../layout/Sidebars');
const Table = require('../helpers/Table');
const { TimeNavigator, CustomTimeNavigator, ShowerNavigator } = require('../helpers/Navigators');
const HistoryChart = require('./HistoryChart');

//sub-containers
const SessionData = require('../../containers/SessionData');

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
                    <i className="fa fa-arrow-up" />
                  </a>
                 :
                 <a onClick={() => setSortOrder('asc')}>
                   <i className="fa fa-arrow-down" />
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
    if (!this.props.synced) {
      this.props.fetchData();
    } 
  },
  handleTypeSelect: function (key) {
    this.props.setMetricFilter(key); 
  },
  handlePeriodSelect: function (key) {
    const time = timeUtil.getTimeByPeriod(key);
    this.props.setQueryAndFetch({ period: key, time });
  },
  handleTimePrevious: function () { 
    this.props.setQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleTimeNext: function () { 
    this.props.setQueryAndFetch({ time: this.props.nextPeriod });
  },
  handleShowerPrevious: function () {
    this.props.setQueryAndFetch({ decreaseShowerIndex: true });
  },
  handleShowerNext: function () {
    this.props.setQueryAndFetch({ increaseShowerIndex: true });
  },
  handleDeviceChange: function (val) {
    const keys = val.map(d => d.value); 
    this.props.setQueryAndFetch({ device: keys });
  },
  handleDeviceTypeSelect: function (val) {
    this.props.setQueryAndFetch({ deviceType: val });
  },
  handleModeSelect: function (val) {
    this.props.setQueryAndFetch({ mode: val });
  },
  handleActiveDevicesChanged: function (vals) {
    const switchDevType = this.props.activeDeviceType === 'METER' ? { deviceType: 'AMPHIRO' } : {};
    this.props.setQueryAndFetch({ device: vals, ...switchDevType });
  },
  handleComparisonSelect: function (val) {
    this.props.setQueryAndFetch({ comparisons: [val] });
  },
  handleSortSelect: function (e, val) {
    this.props.setSortFilter(val);
  },
  render: function () {
    const { _t, chart, mu, amphiros, activeDevice, 
      activeDeviceType, timeFilter, time, metrics, periods, comparisons, deviceTypes, data, 
      hasShowersBefore, hasShowersAfter, forecasting, pricing } = this.props;
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
                  title={_t(period.title)} 
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
              activeKey={this.props.mode} 
              onSelect={this.handleModeSelect}
            >
              {
                this.props.modes.map(mode => (
                  <bs.Tab 
                    key={mode.id} 
                    eventKey={mode.id} 
                    title={mode.title} 
                  /> 
                ))
              }
            </bs.Tabs>
            <br />
            <br />
            <br />
            <br />
            <bs.Tabs 
              position="left" 
              tabWidth={20} 
              activeKey={this.props.filter} 
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
            
            { this.props.memberFilters && this.props.memberFilters.length > 0 ? 
              <div>
                <h5 style={{ marginLeft: 20 }}>Filter by</h5>
                <bs.Tabs 
                  position="left" 
                  tabWidth={20} 
                  activeKey={this.props.memberFilter} 
                  onSelect={(val) => {
                    this.props.setQueryAndFetch({ memberFilter: val });
                  }}
                >
                  {
                    this.props.memberFilters.map(filter => (
                      <bs.Tab 
                        key={filter.id} 
                        eventKey={filter.id}
                        title={filter.title} 
                      /> 
                    ))
                  }
                </bs.Tabs>
              </div>
              : <div />
            }
            <br />

            { 
              this.props.compareAgainst && this.props.compareAgainst.length > 0 ?
                <h5 style={{ marginLeft: 20 }}>Compare against</h5>
                :
                <span />
            }
            {
              <div className="clearfix">
                <ul className="col-xs-20 nav nav-pills nav-stacked">
                  {
                    this.props.compareAgainst.map((comparison, i) => (
                      <li 
                        key={comparison.id} 
                        role="presentation" 
                        className={this.props.comparisons.find(c => c.id === comparison.id) ? 'active' : ''}
                      >
                      <a onClick={() => this.handleComparisonSelect(comparison.id)}>{comparison.title}
                      {
                        this.props.comparisons.find(c => c.id === comparison.id) ?
                          <i style={{ float: 'right', marginRight: -5, marginTop: 5 }} className="fa fa-times" />
                          :
                          <i />
                          }
                        </a>
                    </li>
                    ))
                  }
                </ul>
              </div>
              } 
            {
              this.props.comparisons.length > 0 ?
                <a 
                  style={{ float: 'right', marginTop: 10, marginRight: 20 }} 
                  onClick={() => this.props.setQueryAndFetch({ clearComparisons: true })}
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
                          updateTime={newTime => this.props.setQueryAndFetch({ time: newTime })}
                          time={time}
                        />
                      );
                    }
                    return (
                      <TimeNavigator 
                        handlePrevious={this.handleTimePrevious} 
                        handleNext={this.handleTimeNext}
                        time={time}
                      />
                    );
                  } else if (timeFilter !== 'all') {
                    return (
                      <ShowerNavigator 
                        handlePrevious={this.handleShowerPrevious} 
                        handleNext={this.handleShowerNext}
                        hasNext={hasShowersAfter()}
                        hasPrevious={hasShowersBefore()}
                        showerRanges={data.map(s => s && s.range ? ({ 
                          first: s.range.first, 
                          last: s.range.last,
                          name: s.name,
                        }) : {})}
                      />
                    );
                  }
                  return <div />;
                })()
              }
              <div className="history-chart">
                <HistoryChart 
                  {...{ ...chart }}
                />
              </div>
              
            </div>        
            <br />

            <SessionsList 
              handleSortSelect={this.handleSortSelect}
              activeDeviceType={activeDeviceType}
              {...this.props} 
            />
          </div>
        </div>
        <SessionData 
          sessions={this.props.sessions} 
          time={this.props.time} 
        />
      </MainSection>
    );
  }
});

module.exports = History;
