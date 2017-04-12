const React = require('react');
const bs = require('react-bootstrap');
const moment = require('moment');
const DatetimeInput = require('react-datetime');
const Select = require('react-select');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../layout/MainSection');
const Topbar = require('../layout/Topbar');
const { SidebarRight } = require('../layout/Sidebars');

const { TimeNavigator } = require('../helpers/Navigators');

const { IMAGES } = require('../../constants/HomeConstants');

const Reports = React.createClass({
  componentWillMount: function () {

  },
  handlePeriodSelect: function (val) {
    this.props.actions.setTime({ 
      startDate: val, 
      endDate: moment(val).endOf('month').valueOf(), 
    });
  }, 
  handlePrevious: function () { 
    this.props.actions.setTime(this.props.previousPeriod);
  },
  handleNext: function () {
    this.props.actions.setTime(this.props.nextPeriod);
  },
  render: function () {
    return (
      <MainSection id="section.reports">
        <div className="section-row-container">
          <div className="primary"> 
            
            <div style={{ margin: '40px 30px', textAlign: 'center' }}>
              <h3>
                <FormattedMessage id="reports.title" />
              </h3>
              <TimeNavigator 
                handlePrevious={this.handlePrevious} 
                handleNext={this.handleNext}
                hasNext={!this.props.isAfterToday}
                time={this.props.time}
              />
              
            <DatetimeInput
              closeOnSelect
              className="reports-time-selector"
              dateFormat="MM/YYYY"
              timeFormat={false}
              inputProps={{ size: 18 }}
              value={moment(this.props.time.startDate).add(5, 'day').valueOf()} 
              isValidDate={curr => curr.valueOf() <= moment().endOf('month').valueOf()}
              viewMode="months"
              onChange={this.handlePeriodSelect}
            />
            </div>
          </div>
          <SidebarRight> 
            <div className="commons-right">
              &nbsp;
            </div>
          </SidebarRight>
        </div>
      </MainSection>
    );
  }
});

module.exports = Reports;
