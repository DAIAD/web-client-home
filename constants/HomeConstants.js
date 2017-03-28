module.exports = {
  IMAGES: '/assets/images/home/svg',
  PNG_IMAGES: '/assets/images/home/png',
  BASE64: 'data:image/png;base64,',
  NOTIFICATION_TITLE_LENGTH: 50,
  CACHE_SIZE: 20,
  SHOWERS_PAGE: 1000,
  COMMONS_MEMBERS_PAGE: 10,
  COMMONS_SEARCH_PAGE: 10,
  SUCCESS_SHOW_TIMEOUT: 2000,
  VOLUME_BOTTLE: 1.5,
  VOLUME_BUCKET: 40,
  VOLUME_POOL: 10000,
  ENERGY_BULB: 0.03,
  ENERGY_HOUSE: 1,
  ENERGY_CITY: 1000,
  BRACKET_COLORS: ['green', 'orange', 'red', 'black'],
  LOCALES: ['en', 'el', 'de', 'es'],
  COUNTRIES: ['United Kingdom', 'Spain', 'Greece'],
  TIMEZONES: [
    'Europe/London',
    'Europe/Madrid',
    'Europe/Athens',
  ],
  MESSAGES_PAGE: 10,
  MESSAGE_TYPES: {
    alerts: 'ALERT',
    announcements: 'ANNOUNCEMENT',
    recommendations: 'RECOMMENDATION_DYNAMIC',
    tips: 'RECOMMENDATION_STATIC',
  }, 
  MAIN_MENU: [{
    name: 'dashboard',
    title: 'section.dashboard',
    image: 'dashboard-menu.svg',
    route: '/dashboard',
    children: [],
  },
  {
    name: 'history',
    title: 'section.history',
    image: 'stats-menu.svg',
    route: '/history',
  },
  {
    name: 'notifications',
    title: 'section.notifications',
    image: 'notifications-menu.svg',
    route: '/notifications',
  },
  {
    name: 'commons',
    title: 'section.commons',
    image: 'commons-menu.svg',
    route: '/commons',
  },
  {
    name: 'settings',
    title: 'section.settings',
    image: 'settings-menu.svg',
    route: '/settings',
    children: [
      {
        name: 'profile',
        title: 'section.profile',
        route: 'settings/profile',
      },
      {
        name: 'members',
        title: 'section.members',
        route: 'settings/members',
        children: [
          {
            name: 'edit',
            title: 'section.membersManage.edit',
            route: 'settings/members',
          },
          {
            name: 'create',
            title: 'section.membersManage.create',
            route: 'settings/members/create',
          },
        ],
      },
      {
        name: 'devices',
        title: 'section.devices',
        route: 'settings/devices',
      },
      {
        name: 'commons',
        title: 'section.commons',
        route: 'settings/commons',
        children: [
          {
            name: 'edit',
            title: 'section.commonsManage.edit',
            route: 'settings/commons',
          }, 
          {
            name: 'create',
            title: 'section.commonsManage.new',
            route: 'settings/commons/create',
          },
          {
            name: 'join',
            title: 'section.commonsManage.join',
            route: 'settings/commons/join',
          },
        ],
      }
    ],
  }],
  DEVICE_TYPES: [
    {
      id: 'METER', 
      title: 'Water meter', 
    }, 
    {
      id: 'AMPHIRO', 
      title: 'Shower devices', 
    }
  ],
  MODES: {
    AMPHIRO: [
      { 
        id: 'stats', 
        title: 'Statistics',
      },
    ],
    METER: [
      { 
        id: 'stats', 
        title: 'Volume',
      },
      {
        id: 'forecasting',
        title: 'Forecasting',
      },
      {
        id: 'pricing',
        title: 'Pricing',
        periods: ['month'],
      },
      {
        id: 'breakdown',
        title: 'Breakdown',
        periods: ['week', 'month', 'year'],
        comparisons: ['last'],
        sort: ['volume'],
      },
      {
        id: 'wateriq',
        title: 'Water IQ',
        periods: ['year'],
        comparisons: ['all', 'nearest', 'similar'],
      },
    ],
  },
  METRICS: {
    METER: [
      {
        id: 'devName',  
        title: 'history.device', 
        icon: 'water-meter.svg', 
        details: 'history.deviceDetails', 
      }, 
      {
        id: 'devType',  
        title: 'history.deviceType', 
        icon: 'water-meter.svg', 
        details: 'history.deviceDetails', 
      }, 
      {
        id: 'count',
        title: 'history.count', 
        details: 'history.countDetails', 
        icon: 'default-ranking.svg', 
      },  
      {
        id: 'volume', 
        title: 'history.volume', 
        details: 'history.volumeDetails', 
        icon: 'volume.svg',
      },
      {
        id: 'forecast',
        title: 'history.forecast',
        details: 'history.forecastDetails',
        icon: 'volume.svg',
      },
      {
        id: 'total', 
        title: 'history.volumeTotal', 
        details: 'history.volumeTotalDetails', 
        icon: 'volume.svg',
      },
      {
        id: 'wateriq',
        title: 'history.wateriq',
        details: 'history.wateriqDetails',
        icon: 'default-ranking.svg',
      },
      {
        id: 'cost',
        title: 'history.cost',
        details: 'history.costDetails',
        icon: 'money.svg',
      },
    ],
    AMPHIRO: [
      {
        id: 'devName',  
        title: 'history.device', 
        icon: 'amphiro_small.svg', 
        details: 'history.durationDetails', 
      }, 
      {
        id: 'volume', 
        title: 'history.volume', 
        details: 'history.volumeDetails', 
        icon: 'volume.svg', 
        clickable: true,
      }, 
      {
        id: 'temperature', 
        title: 'history.temperature', 
        details: 'history.temperatureDetails',
        icon: 'temperature.svg', 
        clickable: true,
      }, 
      {
        id: 'energy',
        title: 'history.energy', 
        details: 'history.energyDetails',
        icon: 'energy.svg', 
      }, 
      {
        id: 'friendlyDuration', 
        title: 'history.duration', 
        details: 'history.durationDetails', 
        icon: 'duration.svg', 
      }, 
    ],
  },
  PERIODS: {
    METER: [
      {
        id: 'day', 
        title: 'periods.day',
      },
      {
        id: 'week', 
        title: 'periods.week',
      },
      {
        id: 'month', 
        title: 'periods.month',
      },
      {
        id: 'year', 
        title: 'periods.year',
      },
      {
        id: 'custom', 
        title: 'periods.custom',
      },
    ],
    AMPHIRO: [
      {
        id: 'ten', 
        title: 'periods.ten',
      },
      {
        id: 'twenty', 
        title: 'periods.twenty',
      },
      {
        id: 'fifty', 
        title: 'periods.fifty',
      },
      {
        id: 'all', 
        title: 'periods.all',
      },
    ],
  },
  FILTER_METRICS: {
    METER: [
      {
        id: 'volume', 
        title: 'Volume',
      },
      {
        id: 'total',
        title: 'Total',
      },
    ],
    AMPHIRO: [
      {
        id: 'volume', 
        title: 'Volume',
      },
      {
        id: 'energy', 
        title: 'Energy',
      },
      {
        id: 'duration', 
        title: 'Duration',
      },
      {
        id: 'temperature', 
        title: 'Temperature',
      },
    ],
  },
  SORT: {
    METER: [
      {
        id: 'timestamp', 
        title: 'Time',
      }, 
      {
        id: 'volume', 
        title: 'Volume',
      },
    ],
    AMPHIRO: [
      {
        id: 'id', 
        title: 'ID',
      }, 
      {
        id: 'timestamp', 
        title: 'Time',
      }, 
      {
        id: 'volume', 
        title: 'Volume',
      }, 
      {
        id: 'devName', 
        title: 'Device',
      }, 
      {
        id: 'energy', 
        title: 'Energy',
      }, 
      {
        id: 'temperature', 
        title: 'Temperature',
      }, 
      {
        id: 'duration', 
        title: 'Duration',
      },
    ],
  },
  COMMONS_USER_SORT: [
    {
      id: 'RANKING',
      title: 'Ranking',
    },
    {
      id: 'FIRSTNAME',
      title: 'First name',
    },
    {
      id: 'LASTNAME',
      title: 'Last name',
    },
    {
      id: 'DATE_JOINED',
      title: 'Date joined',
    },
  ],
  STATBOX_DISPLAYS: [
    {
      id: 'stat', 
      title: 'Stat',
    }, 
    {
      id: 'chart', 
      title: 'Chart',
    },
  ],
  WIDGET_TYPES: {
    AMPHIRO: [
      {
        id: 'totalVolumeStat', 
        title: 'Shower Volume Stat', 
        description: 'A stat widget displaying the total consumption for your last 10 showers. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'volume', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'totalVolumeChart', 
        title: 'Shower Volume Chart', 
        description: 'A chart widget presenting the consumption for your last 10 showers for all installed devices. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'volume', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'totalEnergyStat', 
        title: 'Shower Energy Stat', 
        description: 'A stat widget displaying the total energy consumption for your last 10 showers. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'energy', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'totalEnergyChart', 
        title: 'Shower Energy Chart', 
        description: 'A chart widget displaying the total energy progress for your last 10 showers. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'energy', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'totalTemperatureStat', 
        title: 'Shower Temperature Stat', 
        description: 'A widget displaying the average temperature for your last 10 showers. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'temperature', 
        display: 'stat',
        period: 'ten',
      }, 
      {
        id: 'totalTemperatureChart', 
        title: 'Shower Temperature Chart', 
        description: 'A widget displaying the average temperature variation for your last 10 showers. You can later change this to show the last 20 or 50 showers.', 
        type: 'total', 
        metric: 'temperature', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'last', 
        title: 'Last shower', 
        description: 'A widget displaying the last shower recorded for all your devices.', 
        type: 'last', 
        metric: 'volume', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'efficiencyEnergy', 
        title: 'Energy efficiency', 
        description: 'A widget displaying your shower energy score for the last 10 showers. You can later change this to see the energy efficiency for the last 20 or 50 showers.', 
        type: 'efficiency', 
        metric: 'energy', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'ranking', 
        title: 'Member ranking', 
        description: 'A widget displaying the household members ranking based on average shower water consumption.', 
        type: 'ranking', 
        metric: 'volume', 
        display: 'hybrid',
        period: 'all',
      },
    ],
    METER: [
      {
        id: 'totalDifferenceStat', 
        title: 'Total Volume Stat', 
        description: 'A widget displaying your household\'s total water consumption for the last month. You can later change it to daily, weekly or yearly consumption.',
        type: 'total', 
        metric: 'volume', 
        display: 'stat',
        period: 'month',
      }, 
      {
        id: 'totalDifferenceChart', 
        title: 'Total Volume Chart', 
        description: 'A chart widget displaying your household\'s total water consumption progress for the last month. You can later change it to daily, weekly or yearly consumption.', 
        type: 'total', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      }, 
      {
        id: 'breakdown', 
        title: 'Water breakdown', 
        description: 'A chart widget displaying your computed water use per household appliance.', 
        type: 'breakdown', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      },
      {
        id: 'forecast', 
        title: 'Forecast', 
        description: 'A chart widget depicting our estimations for your water use for the next month based on your use so far! You can later change this to see estimations for the next day, week, or year.', 
        type: 'forecast', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      },
      {
        id: 'pricing', 
        title: 'Pricing', 
        description: 'A chart widget showing your monthly consumption within the price ranges', 
        type: 'pricing', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      },
      {
        id: 'comparison', 
        title: 'Comparison', 
        description: 'A widget showing your consumption in comparison to others, like your neighbors or your city average for the previous month.', 
        type: 'comparison', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
        periodIndex: 1,
      },
      {
        id: 'budget', 
        title: 'Monthly Budget', 
        description: 'A widget showing your consumption based on your daily budget.', 
        type: 'budget', 
        metric: 'volume', 
        display: 'chart', 
        period: 'month',
      },
      {
        id: 'wateriqStat', 
        title: 'Water IQ Stat', 
        description: 'A widget showing your Water IQ for the previous month.', 
        type: 'wateriq', 
        metric: 'volume', 
        display: 'stat',
        period: 'month',
        periodIndex: 1,
      },
      {
        id: 'wateriqChart', 
        title: 'Water IQ Chart',
        description: 'A chart widget showing your Water IQ for the previous month against your city, neighbors and similar users.', 
        type: 'wateriq', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
        periodIndex: 1,
      },
    ],
  },
  HEATING_SYSTEMS: ['electricity', 'oil', 'gas'],
  SYSTEM_UNITS: ['metric', 'imperial'],
  AMPHIRO_PROPERTIES: [
    {
      id: 'heating-system',
      type: 'select',
      //options: ['electricity', 'oil', 'gas'],
      options: [0, 1, 2],
    },
    {
      id: 'heating-efficiency',
      type: 'input',
      options: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    {
      id: 'cost-energy',
      type: 'input',
      options: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    {
      id: 'cost-water',
      type: 'input',
      options: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    {
      id: 'share-of-solar',
      type: 'input',
      options: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
  ],
};

