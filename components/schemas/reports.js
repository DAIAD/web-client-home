const React = require('react');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { IMAGES } = require('../../constants/HomeConstants');

const reports = [
  {
    id: 'id',
    name: '',
    value: () => '',
  },
  {
    id: 'period',
    name: <FormattedMessage id="reports.period" />,
    icon: 'calendar',
  },
  {
    id: 'createdOn',
    name: <FormattedMessage id="reports.created" />,
    value: value => <FormattedDate value={value} />,
  },
  {
    id: 'size',
    name: <FormattedMessage id="reports.size" />,
  },
  {
    id: 'url',
    name: '',
    value: value => 
      <a href={value}>
        <i className="fa fa-download navy" style={{ marginRight: 10 }} />
        <FormattedMessage id="forms.download" />
      </a>,
  }
];


module.exports = {
  reports,
};
