const React = require('react');
const { FormattedDate, FormattedMessage } = require('react-intl');
const bs = require('react-bootstrap');

const MainSection = require('../../layout/MainSection');
const Topbar = require('../../layout/Topbar');
const { SidebarLeft, SidebarRight } = require('../../layout/Sidebars');
const { TimeNavigator, CustomTimeNavigator, ShowerNavigator } = require('../../helpers/Navigators');
const { Tabs, TabsMulti, Tab } = require('../../helpers/Tabs');
const HistoryChart = require('./HistoryChart');
const SessionsList = require('./SessionsList');
const DisplayMetric = require('../../helpers/DisplayMetric');

//sub-containers
const SessionData = require('../../../containers/SessionData');

//utils
const timeUtil = require('../../../utils/time');
const { IMAGES, PNG_IMAGES, BASE64 } = require('../../../constants/HomeConstants');

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
  handleActiveDevicesChanged: function (val) {
    const switchDevType = this.props.activeDeviceType === 'METER' ? { deviceType: 'AMPHIRO' } : {};
    const found = this.props.activeDevice.find(d => d === val);
    const device = found ? this.props.activeDevice.filter(d => d !== val) : [...this.props.activeDevice, val];
    this.props.setQueryAndFetch({ device, ...switchDevType });
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
          <Tabs 
            className="history-time-nav" 
            position="top" 
            tabWidth={3} 
            activeKey={timeFilter} 
            onSelect={this.handlePeriodSelect}
          >
            {
              periods.map(period => (
                <Tab 
                  key={period.id} 
                  eventKey={period.id} 
                  title={_t(period.title)} 
                />
              ))
            } 
          </Tabs>
        </Topbar>
        <div className="section-row-container">
          <SidebarLeft> 
            { this.props.activeDeviceType === 'METER' ?
            <Tabs 
              position="left" 
              tabWidth={20} 
              activeKey={this.props.mode} 
              onSelect={this.handleModeSelect}
            >
              {
                this.props.modes.map(mode => (
                  <Tab 
                    key={mode.id} 
                    eventKey={mode.id} 
                    image={mode.image ? `${IMAGES}/${mode.image}` : null}
                    title={_t(mode.title)} 
                  /> 
                ))
              }
            </Tabs>
            : <span /> }
            { this.props.activeDeviceType === 'AMPHIRO' ? 
            <Tabs 
              activeKey={this.props.filter} 
              onSelect={this.handleTypeSelect}
            >
              {
                metrics.map(metric => (
                  <Tab 
                    key={metric.id} 
                    eventKey={metric.id} 
                    title={_t(metric.title)} 
                    image={`${IMAGES}/${metric.image}`}
                  /> 
                ))
              }
            </Tabs>
            : <span /> 
            }
            <br />
            <br />
            { this.props.memberFilters && this.props.memberFilters.length > 0 ? 
              <div>
                <Tabs
                  activeKey={this.props.memberFilter}
                  onSelect={val => this.props.setQueryAndFetch({ memberFilter: val })}
                >
                {
                  this.props.memberFilters.map(filter => (
                    <Tab
                      key={filter.id}
                      eventKey={filter.id}
                      title={filter.title}
                      className="member-tab"
                      image={filter.image}
                    />
                    ))
                }
              </Tabs>
              </div>
              : <div />
            }
          </SidebarLeft>
          <SidebarRight> 
            {
              <Tabs 
                position="left" 
                tabWidth={20} 
                activeKey={this.props.activeDeviceType} 
                onSelect={this.handleDeviceTypeSelect}
              >
                {
                 deviceTypes.map(devType => ( 
                   <Tab 
                     key={devType.id} 
                     eventKey={devType.id} 
                     title={_t(devType.title)} 
                     image={`${IMAGES}/${devType.image}`}
                   /> 
                 ))
                }
              </Tabs>
            }
            
            <TabsMulti
              activeKeys={this.props.activeDevice}
              onSelect={this.handleActiveDevicesChanged}
            >
            {
              this.props.amphiros.map(device => (
                <Tab
                  key={device.deviceKey}
                  eventKey={device.deviceKey}
                  title={device.name}
                  className={`amphiro-tab ${this.props.activeDeviceType !== 'AMPHIRO' ? 'blur' : ''}`}
                />
                ))
            }
            </TabsMulti>
            <br />
            { 
              this.props.compareAgainst && this.props.compareAgainst.length > 0 ?
                <h5 style={{ marginLeft: 20 }}><FormattedMessage id="history.compare-against" /></h5>
                :
                <span />
            }
              <TabsMulti
                activeKeys={this.props.comparisons.map(c => c.id)}
                onSelect={val => this.handleComparisonSelect(val)}
              >
              {
                this.props.compareAgainst.map(comparison => (
                  <Tab
                    key={comparison.id}
                    eventKey={comparison.id}
                    image={comparison.image}
                    title={comparison.title}
                    className="compare-tab"
                  />
                ))}
              </TabsMulti>
            {
              this.props.comparisons.length > 0 ?
                <button
                  className="btn-a"
                  style={{ float: 'right', marginTop: 10, marginRight: 20 }} 
                  onClick={() => this.props.setQueryAndFetch({ clearComparisons: true })}
                >
                  <FormattedMessage id="forms.clear" />
                </button>
                :
                <div />
            }
          </SidebarRight>
          <div className="primary"> 
            <div className="history-chart-area">
              <h3 style={{ textAlign: 'center', margin: '10px 0 0 0' }}>
                <DisplayMetric value={this.props.reducedMetric} />
                &nbsp;
                <span style={{ fontSize: '0.5em' }}>{ this.props.reducedType }</span>
              </h3>
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
                        hasNext={!this.props.isAfterToday}
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
              <HistoryChart 
                {...chart}
              />
              
            </div>        
            <br />

            <SessionsList 
              _t={_t}
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
