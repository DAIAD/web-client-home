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

const theme = require('../chart/themes/history');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../schemas/commons');
const timeUtil = require('../../utils/time');
const { debounce } = require('../../utils/general');

const { IMAGES, METER_PERIODS, COMMONS_MEMBERS_PAGE, COMMONS_USER_SORT } = require('../../constants/HomeConstants');

const CommonsDetails = React.createClass({
  handlePeriodSelect: function (key) {
    const time = timeUtil.getTimeByPeriod(key);
    if (time) this.props.actions.setDataQueryAndFetch({ timeFilter: key, time });
  },
  handlePrevious: function () { 
    this.props.actions.setDataQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleNext: function () { 
    this.props.actions.setDataQueryAndFetch({ time: this.props.nextPeriod });
  },
  handleSortSelect: function (e, val) {
    this.props.actions.setMemberQueryAndFetch({ sortBy: val });
  },
  render: function () {
    const { _t, active, time, timeFilter, chartCategories, chartData, members, actions } = this.props;
    const { selected: selectedMembers, active: activeMembers, sortFilter, sortOrder, searchFilter, count: memberCount, pagingIndex } = members;
    const { addMemberToChart, removeMemberFromChart, setMemberSortFilter, setMemberSortOrder, setMemberSearchFilter, searchCommonMembers, setMemberQueryAndFetch, fetchData, setDataQueryAndFetch } = actions;
    if (!active) {
      return (
        <div>
          <h5 style={{ marginLeft: 30 }}>Select a commons from the list to see more</h5>
        </div>
      );
    }
    const { name, owned } = active;

    const periods = METER_PERIODS
    .filter(period => period.id !== 'day');
    const mu = 'lt';

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
                   this.props.actions.setDataQueryAndFetch({ time: newTime });
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
          <form 
            className="search-field" 
            onSubmit={(e) => { 
              e.preventDefault(); 
              setMemberQueryAndFetch({ index: 0 }); 
            }}
          >
            <input 
              type="text"
              placeholder="Search member..."
              onChange={(e) => { 
                setMemberSearchFilter(e.target.value);
                debounce(() => { 
                  setMemberQueryAndFetch({ index: 0 }); 
                }, 300)();
              }}
              value={searchFilter}
            />
            <button 
              className="clear-button" 
              type="reset" 
              onClick={(e) => { setMemberQueryAndFetch({ index: 0, name: '' }); }} 
            />
          </form>

        </div>

        <div style={{ float: 'right', marginRight: 10 }}> 
          <h5 style={{ float: 'left', marginTop: 5 }}>Sort by:</h5>
          <div 
            className="sort-options" 
            style={{ float: 'right', marginLeft: 10, textAlign: 'right' }}
          >
            <bs.DropdownButton
              title={COMMONS_USER_SORT.find(sort => sort.id === sortFilter) ? 
                COMMONS_USER_SORT.find(sort => sort.id === sortFilter).title
                : 'Last name'}
              id="sort-by"
              defaultValue={sortFilter}
              onSelect={this.handleSortSelect}
            >
              {
                COMMONS_USER_SORT.map(sort =>
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
                  <a onClick={() => setMemberQueryAndFetch({ sortOrder: 'desc' })}>
                    <i className="fa fa-arrow-up" />
                  </a>
                 :
                 <a onClick={() => setMemberQueryAndFetch({ sortOrder: 'asc' })}>
                   <i className="fa fa-arrow-down" />
                 </a>
              }
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
        <span style={{ marginLeft: 20 }}><b>Found:</b> {memberCount}</span>
        <p style={{ marginLeft: 20 }}><i className="fa fa-info-circle" />&nbsp;<i>Click on up to 3 members to compare against</i></p>
        <Table
          className="session-list"
          rowClassName={row => selectedMembers.find(m => m.key === row.key) ? 'session-list-item selected' : 'session-list-item'}
          fields={membersSchema}
          data={activeMembers}
          pagination={{
            total: Math.ceil(memberCount / COMMONS_MEMBERS_PAGE),
            active: pagingIndex,
            onPageClick: (page) => { 
              setMemberQueryAndFetch({ index: page - 1 });
            },
          }}
          onRowClick={(row) => {
            if (selectedMembers.map(u => u.key).includes(row.key)) {
              removeMemberFromChart(row);
            } else if (selectedMembers.length < 3) {
              addMemberToChart({ ...row, selected: selectedMembers.length + 1 });
            }
          }}
          empty={<span />}
        />
      </div>
    );
  }
});

const Commons = React.createClass({
  componentWillMount: function () {
    if (!this.props.synced) {
      this.props.actions.fetchData();
    } 
    if (this.props.active) {
      this.props.actions.searchCommonMembers();
    }
  },
  render: function () {
    const { intl, active, myCommons, mode, searchFilter, members: { count: memberCount }, actions } = this.props;
    const { setDataQueryAndFetch, setSearchFilter, resetConfirm, confirm, clickConfirm, goToManage, goToJoin } = actions;
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
                  <p style={{ marginLeft: 40 }}>Please select a community from the list, or join one in Settings</p>
                </div>
              }
   
              <div style={{ marginBottom: 50 }} />
            </div>
          </div>

          <SidebarRight> 
            <div className="commons-right">
              <div> 
                { 
                  active && active.image ? 
                    <img 
                      style={{ 
                        marginTop: 20, 
                        marginBottom: 20,
                        height: 100,
                        width: 100,
                        border: '2px #2D3580 solid',
                      }} 
                      src={`data:image/png;base64,${active.image}`} 
                      alt="commons" 
                    />
                    :
                    <img 
                      style={{ 
                        marginTop: 20, 
                        marginBottom: 20,
                        height: 100,
                        width: 100,
                        background: '#2D3580',
                        border: '2px #2D3580 solid',
                      }} 
                      src={`${IMAGES}/commons-menu.svg`} 
                      alt="commons-default" 
                    />
                }
                {
                  myCommons.length === 0 ? 
                    <div>
                      <span>Not a member of any commmunities yet</span>
                      <button
                        style={{ width: '100%', marginTop: 20 }}
                        onClick={() => goToJoin()}
                      >
                        Join
                      </button>
                    </div>

                    :
                    <div>
                      <bs.DropdownButton
                        pullRight
                        title={active ? active.name : 'Select'}
                        id="select-commons"
                        value={active ? active.id : null}
                        onSelect={(e, val) => { 
                          setDataQueryAndFetch({ active: val });
                        }}
                      >
                        {
                          myCommons.map(common => 
                            <bs.MenuItem 
                              key={common.key} 
                              eventKey={common.key} 
                              value={common.key}
                            >
                            { common.name || 'No name'}
                            </bs.MenuItem>
                          )
                        }	
                      </bs.DropdownButton>
                      { active ? 
                        <p>
                          <span><i className="fa fa-info-circle" />&nbsp; {active.description}</span>
                          <br />
                          <span>{`${memberCount} members`}</span>
                        </p>
                        : <span />
                      }
                      {
                        active && this.props.hide ?
                          <button
                            style={{ width: '100%', marginTop: 20 }}
                            onClick={() => goToManage()}
                          >
                            Manage
                          </button>
                          :
                          <span />
                       }
                     </div>
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
