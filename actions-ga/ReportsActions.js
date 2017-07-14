const ReactGA = require('react-ga');

const Actions = require('../actions/ReportsActions');

const onDownloadReport = function (month) {
  ReactGA.event({
    category: 'reports',
    action: 'download report',
    label: month.toString(),
  });
  return Actions.onDownloadReport(month);
};

const setTime = function (time) {
  ReactGA.event({
    category: 'reports',
    action: 'change-time',
    label: `${time.startDate}-${time.endDate}`
  });
  return Actions.setTime(time);
};

module.exports = {
  ...Actions,
  setTime,
  onDownloadReport,
};
