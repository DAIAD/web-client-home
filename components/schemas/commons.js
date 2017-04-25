const React = require('react');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { IMAGES } = require('../../constants/HomeConstants');

const commons = [
  {
    id: 'key',
    //name: <FormattedMessage id="commons.key" />,
    //value: () => '',
  },
  {
    id: 'name',
    name: <FormattedMessage id="commonsManage.name" />,
  },
  {
    id: 'membersCount',
    name: <FormattedMessage id="commonsManage.members" />,
  },
  {
    id: 'description',
    name: '',
    value: () => '',
  },
  {
    id: 'consumption',
    name: 'Last month',
  },
  {
    id: 'showMore',
    name: '',
    value: () => ' ',
    //<img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
  },

];

const allCommons = [
  {
    id: 'key',
    name: '',
    value: () => '',
  },
  {
    id: 'name',
    name: <FormattedMessage id="commonsManage.name" />,
  },
  {
    id: 'size',
    name: <FormattedMessage id="commonsManage.members" />,
  },
  {
    id: 'description',
    name: <FormattedMessage id="commonsManage.description" />,
  },
  {
    id: 'createdOn',
    name: 'Created',
    value: value => <FormattedDate value={value} />,
  },
  {
    id: 'member',
    name: 'Member',
    value: value => value ? <div style={{ textAlign: 'left' }}><i style={{ marginRight: 20, marginTop: 0, marginBottom: 0 }} className="checkbox fa fa-check" /></div> : <i />,
  },
];

const members = [
  {
    id: 'key',
    name: '',
    value: () => ''
  },
  {
    id: 'ranking',
    name: <FormattedMessage id="commons.ranking" />,
    //value: (value, row) => `#${value}`, 
  },
  {
    id: 'firstname',
    name: <FormattedMessage id="profile.firstname" />,
  },
  {
    id: 'lastname',
    name: <FormattedMessage id="profile.lastname" />,
  },
  {
    id: 'joinedOn',
    name: <FormattedMessage id="commons.memberSince" />,
    value: value => (<FormattedDate value={value} />),
  },
  /*
  {
    id: 'consumption',
    name: 'Last month',
    //value: value => `${value} lt`,
  },
  */
  {
    id: 'selected',
    name: <FormattedMessage id="common.chart" />,
    value: value => value ? <div style={{ textAlign: 'left', fontSize: '0.9em' }}><i style={{ margin: 0 }} className="checkbox fa fa-check" /></div> : <i />,
  },
  /*
  {
    id: 'efficiency',
    name: 'Efficiency',
  },
  */
];


module.exports = {
  commons,
  allCommons,
  members,
};
