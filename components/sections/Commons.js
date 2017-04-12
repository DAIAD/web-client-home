const React = require('react');
const bs = require('react-bootstrap');
const Select = require('react-select');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { Link } = require('react-router');
const { LineChart, BarChart } = require('react-echarts');

const MainSection = require('../layout/MainSection');
const Topbar = require('../layout/Topbar');

const Table = require('../helpers/Table');
const { TimeNavigator, CustomTimeNavigator } = require('../helpers/Navigators');
const { SidebarRight } = require('../layout/Sidebars');

const theme = require('../chart/themes/history');

const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../schemas/commons');
const timeUtil = require('../../utils/time');
const { debounce } = require('../../utils/general');

const { IMAGES, COMMONS_MEMBERS_PAGE, COMMONS_USER_SORT, BASE64 } = require('../../constants/HomeConstants');

function ChartArea(props) {
  const { _t, handlePrevious, handleNext, time, timeFilter, chartData, chartCategories, actions } = props;
  const { setDataQueryAndFetch } = actions;
  const mu = 'lt';
  return (
    <div className="history-chart-area">
      { 
        timeFilter === 'custom' ?  
          <CustomTimeNavigator 
            updateTime={(newTime) => { 
               setDataQueryAndFetch({ time: newTime });
            }}
            time={time}
          />
          :
          <TimeNavigator 
            handlePrevious={handlePrevious} 
            handleNext={handleNext}
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
        colors={theme.colors}
        series={chartData.map(s => ({
          ...s,
        }))}
      />
    </div>
  );
}

function MembersArea(props) {
  const { _t, handleSortSelect, searchFilter, members, actions } = props;

  const { selected: selectedMembers, active: activeMembers, sortFilter, sortOrder, count: memberCount, pagingIndex } = members;

  const { setDataQueryAndFetch, setSearchFilter, addMemberToChart, removeMemberFromChart, setMemberSortFilter, setMemberSortOrder, setMemberSearchFilter, searchCommonMembers, setMemberQueryAndFetch, fetchData } = actions;

  return (
    <div className="commons-members-area">
      <div style={{ marginTop: 20, marginBottom: 0, marginLeft: 20 }}>
        <h5>
          <FormattedMessage id="commons.members" />
        </h5>
      </div>
      <div className="members-search" style={{ float: 'left', marginLeft: 20 }}>
        <form 
          className="search-field" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            setMemberQueryAndFetch({ index: 0 }); 
          }}
        >
          <input 
            type="text"
            placeholder={_t('commons.placeholder-search-members')}
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

      <div className="members-sort" style={{ float: 'right', marginRight: 10 }}> 
        <h5 style={{ float: 'left', marginTop: 5 }}><FormattedMessage id="common.sortby" /></h5>
        <div 
          className="sort-options" 
          style={{ float: 'right', marginLeft: 10, textAlign: 'right' }}
        >
          <bs.DropdownButton
            title={COMMONS_USER_SORT.find(sort => sort.id === sortFilter) ? 
              _t(COMMONS_USER_SORT.find(sort => sort.id === sortFilter).title)
              : _t('profile.lastname')}
            id="sort-by"
            defaultValue={sortFilter}
            onSelect={handleSortSelect}
          >
            {
              COMMONS_USER_SORT.map(sort =>
                <bs.MenuItem
                  key={sort.id}
                  eventKey={sort.id}
                  value={sort.id}
                >
                  {_t(sort.title)}
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
      
      <br />
      <div>
        <p style={{ marginLeft: 20 }}><b><FormattedMessage id="common.found" />:</b> {memberCount}</p>
        <p style={{ marginLeft: 20 }}><i className="fa fa-info-circle" />&nbsp;<i><FormattedMessage id="commons.select-info" /></i></p>
      </div>

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
      />
    </div>
  );
}

const Commons = React.createClass({
  componentWillMount: function () {
    if (!this.props.synced) {
      this.props.actions.fetchData();
    } 
    if (this.props.favorite) {
      this.props.actions.setDataQueryAndFetch({ active: this.props.favorite });
    }

    if (this.props.active) {
      this.props.actions.searchCommonMembers();
    }
  },
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
  handleDeviceTypeSelect: function (val) {
    this.props.actions.setDataQueryAndFetch({ deviceType: val });
  },
  render: function () {
    const { _t, activeDeviceType, deviceTypes, active, myCommons, mode, searchFilter, periods, time, timeFilter, chartCategories, chartData, members, actions } = this.props;
    const { selected: selectedMembers, active: activeMembers, sortFilter, sortOrder, count: memberCount, pagingIndex } = members;
    
    const { setDataQueryAndFetch, setSearchFilter, resetConfirm, confirm, clickConfirm, goToManage, goToJoin, addMemberToChart, removeMemberFromChart, setMemberSortFilter, setMemberSortOrder, setMemberSearchFilter, searchCommonMembers, setMemberQueryAndFetch, fetchData } = actions;

    return (
      <MainSection id="section.commons">
        <Topbar> 
          { active ? 
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
          : 
          <span />
          }
        </Topbar>
        <div className="section-row-container">
          <div className="primary"> 
            <div className="commons-details"> 
              { 
                active ? 
                  <div> 
                    <ChartArea 
                      handlePrevious={this.handlePrevious}
                      handleNext={this.handleNext}
                      {...this.props} 
                    />
                    <MembersArea 
                      handleSortSelect={this.handleSortSelect}
                      {...this.props} 
                    />
                  </div>
                :
                <div>
                  <h3 style={{ marginTop: 20, marginLeft: 40 }}>
                    <FormattedMessage id="commons.myCommons" />
                  </h3>
                </div>
              }
   
              <div style={{ marginBottom: 50 }} />
            </div>
          </div>
          <SidebarRight> 
            <div className="commons-right">
              <div style={{ padding: 20 }}> 
                { 
                  active && active.image ? 
                    <img 
                      style={{ 
                        marginBottom: 20,
                        height: 120,
                        width: 120,
                        border: '2px #2D3580 solid',
                      }} 
                      src={`${BASE64}${active.image}`} 
                      alt="commons" 
                    />
                    :
                    <img 
                      style={{ 
                        marginBottom: 20,
                        height: 120,
                        width: 120,
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
                      <FormattedMessage id="commons.noCommons" />
                      <button
                        style={{ width: '100%', marginTop: 20 }}
                        onClick={goToJoin}
                      >
                        <FormattedMessage id="forms.join" />
                      </button>
                    </div>

                    :
                   <div>
                     <bs.DropdownButton
                       className="commons-select-active"
                       style={{ width: 120 }}
                       pullRight
                       title={active ? active.name : _t('forms.select')}
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
                            { common.name || _t('forms.noname')}
                            </bs.MenuItem>
                          )
                        }	
                      </bs.DropdownButton>
                      { active ? 
                        <p>
                          <span>
                            <i className="fa fa-info-circle" />
                            &nbsp; {active.description}
                          </span>
                        </p>
                        :
                        <span />
                      }
                     </div>
                     }
                   </div>
                
                   {
                     active ? 
                      <bs.Tabs 
                        position="left" 
                        tabWidth={20} 
                        activeKey={activeDeviceType} 
                        onSelect={this.handleDeviceTypeSelect}
                      >
                      {
                       deviceTypes.map(devType => ( 
                         <bs.Tab 
                           key={devType.id} 
                           eventKey={devType.id} 
                           title={_t(devType.title)} 
                         /> 
                       ))
                      }
                    </bs.Tabs>
                  :
                  <span />
                  }

              </div>
          </SidebarRight>

        </div>
      </MainSection>
    );
  }
});

module.exports = Commons;
