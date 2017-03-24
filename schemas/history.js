const React = require('react');
const { FormattedDate, FormattedMessage } = require('react-intl');
const { IMAGES } = require('../constants/HomeConstants');

const meter = [
  {
    id: 'volume',
    name: 'Volume',
    value: (value, row) => 
      <span style={{ fontSize: '2.5em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'comparison',
    name: '',
    value: (value, row) => {
      const { min, max } = row;
      if (row.percentDiff == null) {
        return (
          <span>
            <i className="dash" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
            { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
          </span>
        );
      } else if (row.percentDiff < 0) {
        return (
          <span>
            <i className="fa fa-arrow-down green" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
          </span>
        );
      }
      return (
        <span>
          <i className="fa fa-arrow-up red" />
          &nbsp;
          { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
        </span>
      );
    },
  },
  {
    id: 'member',
    name: 'User',
    icon: 'user',
  },
  {
    id: 'date',
    name: 'Date',
    icon: 'calendar',
  },
  {
    id: 'showMore',
    name: '',
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,

  }
];

const amphiro = [
  {
    id: 'volume',
    name: 'Volume',
    value: (value, row) => 
      <span style={{ fontSize: '2.5em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'comparison',
    name: '',
    value: (value, row) => {
      if (row.percentDiff == null) {
        return <i className="dash" />;
      } else if (row.percentDiff < 0) {
        return <i className="fa fa-arrow-down green" />;
      }
      return <i className="fa fa-arrow-up red" />;
    },
  },
  {
    id: 'member',
    name: 'User',
    icon: 'user',
  },
  {
    id: 'timestamp',
    name: 'Date',
    icon: 'calendar',
    value: value => <FormattedDate value={value} />,
  },
  {
    id: 'devName',
    name: 'Device',
  },
  {
    id: 'friendlyDuration',
    name: 'Dur',
    icon: 'clock-o',
  },
  {
    id: 'energyClass',
    name: 'En',
    icon: 'flash',
  },
  {
    id: 'temperature',
    name: 'Temp',
    icon: 'temperature',
    value: (value, row) => `${value} ºC`
  },
  {
    id: 'realtime',
    name: 'Real',
    value: (value, row) => row.history ? 
      <i />
      :
      <i className="fa fa-check" />,
  },
  {
    id: 'id',
    name: 'Id',
    //value: (value, row) => `${value}`,
  },
  {
    id: 'showMore',
    name: '',
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
  }
];

const breakdown = [
  {
    id: 'title',
    name: 'Usage',
    value: (value, row) => (
      <span style={{ fontSize: '1.5em' }}>
        <img src={`${IMAGES}/${row.id}.svg`} alt={value} style={{ marginRight: 10 }} />
        <span>{value}</span>
      </span>
    ),
  },
  {
    id: 'volume',
    name: 'Volume',
    value: (value, row) => 
      <span style={{ fontSize: '2.5em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'showMore',
    name: '',
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,
  },
];

const wateriq = [
  {
    id: 'wateriq',
    name: 'Water IQ',
    value: value => <span style={{ fontSize: '2.5em', marginLeft: 20 }}>{value}</span>,
  },
  {
    id: 'volume',
    name: 'Volume',
    value: (value, row) => 
      <span style={{ fontSize: '2.5em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'comparison',
    name: '',
    value: (value, row) => {
      const { min, max } = row;
      if (row.percentDiff == null) {
        return (
          <span>
            <i className="dash" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
            { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
          </span>
        );
      } else if (row.percentDiff < 0) {
        return (
          <span>
            <i className="fa fa-arrow-down green" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
          </span>
        );
      }
      return (
        <span>
          <i className="fa fa-arrow-up red" />
          &nbsp;
          { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
        </span>
      );
    },
  },
  {
    id: 'date',
    name: 'Date',
    icon: 'calendar',
  },
  {
    id: 'showMore',
    name: '',
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,

  }
];

const pricing = [
  {
    id: 'cost',
    name: 'Cost',
    icon: 'euro',
    value: value => <span style={{ fontSize: '2.5em' }}>{`${value} \u20AC`}</span>,
  },
  {
    id: 'total',
    name: 'Total',
    value: (value, row) => 
      <span style={{ fontSize: '2.0em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'volume',
    name: 'Volume',
    value: (value, row) => 
      <span style={{ fontSize: '1.5em' }}>
        {value}
        <span style={{ fontSize: '0.6em' }}> lt</span>
      </span>,
  },
  {
    id: 'comparison',
    name: '',
    value: (value, row) => {
      const { min, max } = row;
      if (row.percentDiff == null) {
        return (
          <span>
            <i className="dash" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
            { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
          </span>
        );
      } else if (row.percentDiff < 0) {
        return (
          <span>
            <i className="fa fa-arrow-down green" />
            &nbsp;
            { min ? <span style={{ fontWeight: 'bold', color: '#7AD3AB' }}>min</span> : <i /> }
          </span>
        );
      }
      return (
        <span>
          <i className="fa fa-arrow-up red" />
          &nbsp;
          { max ? <span style={{ fontWeight: 'bold', color: '#CD4D3E' }}>max</span> : <i /> }
        </span>
      );
    },
  },

  {
    id: 'date',
    name: 'Date',
    icon: 'calendar',
  },
  {
    id: 'showMore',
    name: '',
    value: () => 
      <img src={`${IMAGES}/arrow-big-right.svg`} alt="details" />,

  }
];

module.exports = {
  meter,
  amphiro,
  breakdown,
  wateriq,
  pricing,
};
