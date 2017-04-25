const React = require('react');
const bs = require('react-bootstrap');
const moment = require('moment');
const DatetimeInput = require('react-datetime');
const Select = require('react-select');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { Link } = require('react-router');

const MainSection = require('../../layout/MainSection');
const Topbar = require('../../layout/Topbar');
const { SidebarRight } = require('../../layout/Sidebars');

const Table = require('../../helpers/Table');
const { TimeNavigator } = require('../../helpers/Navigators');

const { reports: reportsFields } = require('../../../schemas/reports');

const { IMAGES } = require('../../../constants/HomeConstants');

const Reports = React.createClass({
  componentWillMount: function () {
    this.props.actions.getReportsStatus();
  },
  handlePeriodSelect: function (val) {
    this.props.actions.setQueryAndFetch({
     time: { 
        startDate: val, 
        endDate: moment(val).endOf('year').valueOf(), 
     },
    });
  }, 
  handlePrevious: function () { 
    this.props.actions.setQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleNext: function () {
    this.props.actions.setQueryAndFetch({ time: this.props.nextPeriod });
  },
  render: function () {
    const { reports } = this.props;
    // TODO: for pdf preview check
    // http://stackoverflow.com/questions/17784037/how-to-display-pdf-file-in-html
    return (
      <MainSection id="section.reports">
        <div className="section-row-container">
          <div className="primary"> 
            <div style={{ marginTop: 50 }} />
            <TimeNavigator 
              handlePrevious={this.handlePrevious} 
              handleNext={this.handleNext}
              hasNext={!this.props.isAfterToday}
              time={this.props.time}
              formatter={{ year: 'numeric', month: 'numeric' }}
            />
            <div style={{ marginTop: 50 }} />
                     
            <Table
              className="session-list"
              rowClassName="reports-list-item"
              fields={reportsFields}
              data={reports}
              empty={
                <h5 style={{ textAlign: 'center' }}>
                  <FormattedMessage id="reports.empty" />
                </h5>
                }
            />
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
