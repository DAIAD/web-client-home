const React = require('react');
const bs = require('react-bootstrap');
const Select = require('react-select');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../../layout/MainSection');
const Topbar = require('../../layout/Topbar');
const { SidebarRight } = require('../../layout/Sidebars');

const CommonsChart = require('./CommonsChart');
const MembersArea = require('./MembersArea');

const timeUtil = require('../../../utils/time');

const { IMAGES, BASE64 } = require('../../../constants/HomeConstants');


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
                    <CommonsChart
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
