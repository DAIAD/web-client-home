const React = require('react');
const { FormattedDate, FormattedMessage } = require('react-intl');
const DisplayMetric = require('../helpers/DisplayMetric');

const { IMAGES } = require('../../constants/HomeConstants');

const meter = [
  {
    id: 'volume',
    name: <FormattedMessage id="history.volume" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  {
    id: 'comparison',
    name: '',
    csv: false,
    value: (value, row) => {
      if (row.percentDiff == null) {
        return (
          <span>
            <i className="dash" />
          </span>
        );
      } else if (row.percentDiff < 0) {
        return (
          <span>
            <img 
              src={`${IMAGES}/better.svg`} 
              style={{ height: 25 }}
              alt="better" 
            />
          </span>
        );
      }
      return (
        <span>
          <img 
            src={`${IMAGES}/worse.svg`} 
            style={{ height: 25 }}
            alt="worse" 
          />
        </span>
      );
    },
  },
  {
    id: 'min-max',
    name: '', 
    csv: false,
    value: (value, row) => {
      const { min, max } = row;
      if (min) {
        return (
          <span>
            <i className="fa fa-check green " />&nbsp;&nbsp;
            <FormattedMessage 
              id="history.consumption-min-short" 
              values={{ period: row.period }} 
            />
          </span>
        );
      } else if (max) {
        return (
          <span>
            <img src={`${IMAGES}/warning.svg`} alt="warn" />&nbsp;&nbsp;
            <FormattedMessage 
              id="history.consumption-max-short" 
              values={{ period: row.period }} 
            />
          </span>
        );
      }
      return <span />;
    },
  },
  {
    id: 'date',
    name: <FormattedMessage id="common.date" />,
    csv: false,
    icon: 'calendar',
  },
  {
    id: 'timestamp',
    name: '',
    value: () => null,
  },
  {
    id: 'showMore',
    name: '',
    csv: false,
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,

  }
];

const amphiro = [
  {
    id: 'volume',
    name: <FormattedMessage id="history.volume" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  {
    id: 'comparison',
    name: '',
    csv: false,
    value: (value, row) => {
      if (row.percentDiff == null) {
        return <i className="dash" />;
      } else if (row.percentDiff < 0) {
        return ( 
          <img 
            src={`${IMAGES}/better.svg`} 
            style={{ height: 25 }}
            alt="better" 
          />
        );
      }
      return ( 
          <img 
            src={`${IMAGES}/worse.svg`} 
            style={{ height: 25 }}
            alt="worse" 
          />
        );
    },
  },
  {
    id: 'member',
    name: <FormattedMessage id="common.user" />,
    icon: 'user',
  },
  {
    id: 'date',
    name: <FormattedMessage id="common.date" />,
    csv: false,
    icon: 'calendar',
  },
  {
    id: 'timestamp',
    name: '',
    value: () => null,
  },
  {
    id: 'deviceName',
    name: <FormattedMessage id="history.device" />,
  },
  {
    id: 'duration',
    name: '',
    icon: 'clock-o',
    value: value => <DisplayMetric value={value} />,
  },
  {
    id: 'energyClass',
    name: '',
    icon: 'flash',
  },
  {
    id: 'temperature',
    name: '',
    icon: 'temperature',
    value: value => <DisplayMetric value={value} />,
  },
  {
    id: 'real',
    name: <FormattedMessage id="history.real" />,
    value: (value, row) => value ? 
      <i className="fa fa-check" />
      :
      <i />,
  },
  {
    id: 'id',
    name: '#',
    //value: (value, row) => `${value}`,
  },
  {
    id: 'showMore',
    name: '',
    csv: false,
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
  }
];

const breakdown = [
  {
    id: 'title',
    name: <FormattedMessage id="history.breakdownUse" />,
    value: (value, row) => (
      <span style={{ fontSize: '1.5em' }}>
        <img src={`${IMAGES}/${row.id}.svg`} alt={value} style={{ marginRight: 10 }} />
        <span>{value}</span>
      </span>
    ),
  },
  {
    id: 'volume',
    name: <FormattedMessage id="history.volume" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  {
    id: 'date',
    name: <FormattedMessage id="common.date" />,
    icon: 'calendar',
  },
  {
    id: 'showMore',
    name: '',
    csv: false,
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
  },
];

const forecast = [
  {
    id: 'forecast',
    name: <FormattedMessage id="history.forecasted" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  ...meter,
];

const wateriq = [
  {
    id: 'wateriq',
    name: <FormattedMessage id="history.wateriq" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  ...meter,
];

const pricing = [
  {
    id: 'cost',
    name: <FormattedMessage id="history.cost" />,
    icon: 'euro',
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  {
    id: 'total',
    name: <FormattedMessage id="history.total" />,
    value: value => <DisplayMetric className="table-highlight" value={value} />,
  },
  ...meter,
];

module.exports = {
  meter,
  amphiro,
  forecast,
  breakdown,
  wateriq,
  pricing,
};
