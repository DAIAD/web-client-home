const React = require('react');
const { FormattedMessage, FormattedDate } = require('react-intl');
const { IMAGES } = require('../constants/HomeConstants');

const commons = [
  {
    id: 'id',
    name: '',
    value: () => '',
  },
  {
    id: 'name',
    name: 'Name',
  },
  {
    id: 'membersCount',
    name: '# members',
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
    id: 'id',
    name: '',
    value: () => '',
  },
  {
    id: 'name',
    name: 'Name',
  },
  {
    id: 'membersCount',
    name: '# members',
  },
  {
    id: 'description',
    name: 'Description',
  },
  {
    id: 'selected',
    name: '',
    value: value => value ?
      <i style={{ marginRight: 20 }} className="checkbox fa fa-check-square-o navy" /> 
      : 
      <i style={{ marginRight: 20 }} className="checkbox fa fa-check-square-o white" />,
  },
];

const members = [
  {
    id: 'id',
    name: '',
    value: () => ''
  },
  {
    id: 'ranking',
    name: 'Ranking',
    value: (value, field, row) => `#${value}`, 
  },
  {
    id: 'name',
    name: 'Name',
  },
  {
    id: 'memberSince',
    name: 'Member since',
    value: value => (<FormattedDate value={value} />),
  },
  {
    id: 'consumption',
    name: 'Last month',
    value: value => `${value} lt`,
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
  },
  {
    id: 'showMore',
    name: '',
    value: () => '' 
    //    <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
      },
];


module.exports = {
  commons,
  allCommons,
  members,
};
