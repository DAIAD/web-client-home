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
    name: 'reports',
    title: 'section.reports',
    image: 'challenge-daily.svg',
    route: '/reports',
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
      title: 'devices.meter', 
    }, 
    {
      id: 'AMPHIRO', 
      title: 'devices.amphiros', 
    }
  ],
  MODES: {
    AMPHIRO: [
      { 
        id: 'stats', 
        title: 'history.stats',
      },
    ],
    METER: [
      { 
        id: 'stats', 
        title: 'history.volume',
      },
      {
        id: 'forecasting',
        title: 'history.forecast',
      },
      {
        id: 'pricing',
        title: 'history.cost',
        periods: ['month'],
      },
      {
        id: 'breakdown',
        title: 'history.breakdown',
        periods: ['week', 'month', 'year'],
        comparisons: ['last'],
        sort: ['volume'],
      },
      {
        id: 'wateriq',
        title: 'history.wateriq',
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
        title: 'history.volume',
      },
      {
        id: 'total',
        title: 'history.total',
      },
    ],
    AMPHIRO: [
      {
        id: 'volume', 
        title: 'history.volume',
      },
      {
        id: 'energy', 
        title: 'history.energy',
      },
      {
        id: 'duration', 
        title: 'history.duration',
      },
      {
        id: 'temperature', 
        title: 'history.temperature',
      },
    ],
  },
  SORT: {
    METER: [
      {
        id: 'timestamp', 
        title: 'common.time',
      }, 
      {
        id: 'volume', 
        title: 'history.volume',
      },
    ],
    AMPHIRO: [
      {
        id: 'id', 
        title: 'history.id',
      }, 
      {
        id: 'timestamp', 
        title: 'common.time',
      }, 
      {
        id: 'volume', 
        title: 'history.volume',
      }, 
      {
        id: 'devName', 
        title: 'history.device',
      }, 
      {
        id: 'energy', 
        title: 'history.energy',
      }, 
      {
        id: 'temperature', 
        title: 'history.temperature',
      }, 
      {
        id: 'duration', 
        title: 'history.duration',
      },
    ],
  },
  COMMONS_USER_SORT: [
    {
      id: 'RANKING',
      title: 'commons.ranking',
    },
    {
      id: 'FIRSTNAME',
      title: 'profile.firstname',
    },
    {
      id: 'LASTNAME',
      title: 'profile.lastname',
    },
    {
      id: 'DATE_JOINED',
      title: 'commons.date-joined',
    },
  ],
  STATBOX_DISPLAYS: [
    {
      id: 'stat', 
      title: 'widget.display-stat',
    }, 
    {
      id: 'chart', 
      title: 'widget.display-chart',
    },
  ],
  WIDGET_TYPES: {
    AMPHIRO: [
      {
        id: 'totalVolumeStatAmphiro', 
        type: 'total', 
        metric: 'volume', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'totalVolumeChartAmphiro', 
        type: 'total', 
        metric: 'volume', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'totalEnergyStat', 
        type: 'total', 
        metric: 'energy', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'totalEnergyChart', 
        type: 'total', 
        metric: 'energy', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'totalTemperatureStat', 
        type: 'total', 
        metric: 'temperature', 
        display: 'stat',
        period: 'ten',
      }, 
      {
        id: 'totalTemperatureChart', 
        type: 'total', 
        metric: 'temperature', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'last', 
        type: 'last', 
        metric: 'volume', 
        display: 'chart',
        period: 'ten',
      },
      {
        id: 'efficiencyEnergy', 
        type: 'efficiency', 
        metric: 'energy', 
        display: 'stat',
        period: 'ten',
      },
      {
        id: 'ranking', 
        type: 'ranking', 
        metric: 'volume', 
        display: 'chart',
        period: 'all',
      },
    ],
    METER: [
      {
        id: 'totalVolumeStatSWM', 
        type: 'total', 
        metric: 'volume', 
        display: 'stat',
        period: 'month',
      }, 
      {
        id: 'totalVolumeChartSWM', 
        type: 'total', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      }, 
      {
        id: 'breakdown', 
        type: 'breakdown', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      },
      {
        id: 'forecast', 
        type: 'forecast', 
        metric: 'volume', 
        display: 'chart',
        period: 'year',
      },
      {
        id: 'pricing', 
        type: 'pricing', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
      },
      {
        id: 'comparison', 
        type: 'comparison', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
        periodIndex: -1,
      },
      {
        id: 'budget', 
        type: 'budget', 
        metric: 'volume', 
        display: 'chart', 
        period: 'month',
      },
      {
        id: 'wateriqStat', 
        type: 'wateriq', 
        metric: 'volume', 
        display: 'stat',
        period: 'month',
        periodIndex: -1,
      },
      {
        id: 'wateriqChart', 
        type: 'wateriq', 
        metric: 'volume', 
        display: 'chart',
        period: 'month',
        periodIndex: -1,
      },
    ],
  },
  HEATING_SYSTEMS: ['electricity', 'oil', 'gas'],
  SYSTEM_UNITS: ['METRIC', 'IMPERIAL'],
  AMPHIRO_PROPERTIES: [
    {
      id: 'heating-system',
      type: 'select',
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

