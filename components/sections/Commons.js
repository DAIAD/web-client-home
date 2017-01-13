const React = require('react');
const bs = require('react-bootstrap');
const Select = require('react-select');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { Link } = require('react-router');
const { LineChart, BarChart } = require('react-echarts');

const MainSection = require('../layout/MainSection');

const Table = require('../helpers/Table');
const { TimeNavigator, CustomTimeNavigator } = require('../helpers/Navigators');
const { SidebarRight } = require('../layout/Sidebars');

const theme = require('../chart/themes/history-bar');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../schemas/commons');
const timeUtil = require('../../utils/time');
const { METER_PERIODS } = require('../../constants/HomeConstants');


const CommonsDetails = React.createClass({
  handlePeriodSelect: function (key) {
    this.props.actions.setTimeFilter(key);

    const time = timeUtil.getTimeByPeriod(key);
    if (time) this.props.actions.setTime(time, true);
  },
  handlePrevious: function () { 
    this.props.actions.setTime(this.props.previousPeriod, true);
  },
  handleNext: function () { 
    this.props.actions.setTime(this.props.nextPeriod, true);
  },
  render: function () {
    const { active, intl, time, timeFilter, chartCategories, chartData, allCommons, selectedMembers, sortFilter, sortOrder, sortOptions, memberSearchFilter, actions } = this.props;
    const { editCommon, deleteCommon, leaveCommon, addMemberToChart, removeMemberFromChart, setSortFilter, setSortOrder, setMemberSearchFilter } = actions;
    
    if (!active) {
      return (
        <div>
          <h5 style={{ marginLeft: 30 }}>Select a commons from the list to see more</h5>
        </div>
      );
    }
    const { name, members, owned } = active;

    const periods = METER_PERIODS
    .filter(period => period.id !== 'day');
    const mu = 'lt';
    const _t = x => intl.formatMessage({ id: x }); 

    return (
      <div>       
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
        
        <div className="history-chart-area">
          { 
            timeFilter === 'custom' ?  
              <CustomTimeNavigator 
                updateTime={(newTime) => { 
                  //this.setTimeAndQuery({ ...time, ...newTime });
                  //this.props.actions.setTimeFilter(key);
                  this.props.actions.setTime(newTime, true);
                }}
                time={time}
              />
              :
              <TimeNavigator 
                handlePrevious={this.handlePrevious} 
                handleNext={this.handleNext}
                time={time}
              />
          }
          <LineChart 
            width="100%"
            height={380}
            theme={theme}
            xAxis={{
              data: chartCategories,
              boundaryGap: true,
            }}
            yAxis={{
              formatter: y => `${y} ${mu}`,
            }}
            series={chartData.map(s => ({
              ...s,
            }))}
          />
          <br />
        </div>

        <div style={{ marginTop: 20, marginBottom: 0, marginLeft: 20 }}>
          <h5>
            <FormattedMessage id="commons.members" />
          </h5>
        </div>
        
        <div>
        <div style={{ float: 'left', marginLeft: 20 }}>
          <form className="search-field" onSubmit={(e) => { e.preventDefault(); }}>
            <input 
              type="text"
              placeholder="Search member..."
              onChange={(e) => { setMemberSearchFilter(e.target.value); }}
              value={memberSearchFilter}
            />
            <button className="clear-button" type="reset" onClick={(e) => { setMemberSearchFilter(''); }} />
          </form>

        </div>

        <div style={{ float: 'right', marginRight: 10 }}> 
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
              onSelect={(e, val) => setSortFilter(val)}
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

            <div style={{ float: 'right', marginLeft: 20 }}>
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

      <br />
      <br />
        <p style={{ marginLeft: 20 }}><i className="fa fa-info-circle" />&nbsp;<i>Click on up to 3 members to compare against</i></p>
        <Table
          className="session-list"
          rowClassName={row => selectedMembers.find(m => m.id === row.id) ? 'session-list-item selected' : 'session-list-item'}
          fields={membersSchema}
          data={members}
          pagination={{
            total: 3,
            active: 2,
            onPageClick: (page) => {},
          }}
          onRowClick={(row) => {
            if (selectedMembers.map(u => u.id).includes(row.id)) {
              removeMemberFromChart(row);
            } else {
              addMemberToChart({ ...row, selected: selectedMembers.length + 1 });
            }
          }}
        />
      </div>
    );
  }
});

const Commons = React.createClass({
  render: function () {
    const { intl, active, commons, allCommons, allCommonsFiltered, mode, searchFilter, confirmation, actions } = this.props;
    const { switchActive, joinCommon, leaveCommon, createCommon, editCommon, deleteCommon, 
      switchToNormal, switchToEdit, switchToCreate, switchToJoin, setSearchFilter, 
      resetConfirm, confirm, clickConfirm, goToManage } = actions;
    const { selected, selectedUsers } = this.props;
    return (
      <MainSection id="section.commons">
        <div className="section-row-container">
          <div className="primary"> 
            <div className="commons-details"> 
              { 
                active ? 
                  <CommonsDetails
                    {...this.props}
                  />
                :
                <div>
                  <h3 style={{ marginTop: 20, marginLeft: 40 }}>My commons</h3>
                  <p style={{ marginLeft: 40 }}>Please select a common from the list, or join a common in Settings</p>
                </div>
              }
   
              <div style={{ marginBottom: 50 }} />
            </div>
          </div>

          <SidebarRight> 
            <div className="commons-right">
              
              <div>
                <label htmlFor="select-commons"><h5 style={{ textAlign: 'center' }}>Active common</h5></label>
                <bs.DropdownButton
                  pullRight
                  title={active ? active.name : 'Explore'}
                  id="select-commons"
                  value={active ? active.id : null}
                  onSelect={(e, val) => { 
                    switchActive(val);
                  }}
                >
                  {
                    commons.map(common => 
                      <bs.MenuItem 
                        key={common.id} 
                        eventKey={common.id} 
                        value={common.id}
                      >
                      { common.name }
                      </bs.MenuItem>
                    )
                  }	
                </bs.DropdownButton>
                { active ? 
                  <p><i className="fa fa-info-circle" />&nbsp; {active.description}</p>
                  : <span />
                }
                {
                  active && this.props.lala ?
                    <button
                      style={{ width: '100%', marginTop: 20 }}
                      onClick={() => {
                        //switchToEdit();
                        goToManage();
                      }}
                    >
                      Manage
                    </button>
                    :
                    <span />
                 }
              </div>
            </div>
          </SidebarRight>

        </div>
      </MainSection>
    );
  }
});

module.exports = Commons;
