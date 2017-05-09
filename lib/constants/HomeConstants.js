'use strict';

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
  ENERGY_BULB: 30,
  ENERGY_HOUSE: 1000,
  ENERGY_CITY: 1000000,
  BRACKET_COLORS: ['green', 'orange', 'red', 'black'],
  LOCALES: ['en', 'el', 'de', 'es'],
  COUNTRIES: ['United Kingdom', 'Spain', 'Greece'],
  TIMEZONES: ['Europe/London', 'Europe/Madrid', 'Europe/Athens'],
  MESSAGES_PAGE: 10,
  MESSAGE_TYPES: {
    alerts: 'ALERT',
    announcements: 'ANNOUNCEMENT',
    recommendations: 'RECOMMENDATION_DYNAMIC',
    tips: 'RECOMMENDATION_STATIC'
  },
  MAIN_MENU: [{
    name: 'dashboard',
    title: 'section.dashboard',
    image: 'dashboard-menu-inactive.svg',
    activeImage: 'dashboard-menu.svg',
    route: '/',
    children: []
  }, {
    name: 'history',
    title: 'section.history',
    image: 'stats-menu-inactive.svg',
    activeImage: 'stats-menu.svg',
    route: '/history'
  }, {
    name: 'notifications',
    title: 'section.notifications',
    image: 'notifications-menu-inactive.svg',
    activeImage: 'notifications-menu.svg',
    route: '/notifications'
  }, {
    name: 'reports',
    title: 'section.reports',
    image: 'reports-menu-inactive.svg',
    activeImage: 'reports-menu.svg',
    route: '/reports'
  }, {
    name: 'commons',
    title: 'section.commons',
    image: 'commons-menu-inactive.svg',
    activeImage: 'commons-menu.svg',
    route: '/commons'
  }, {
    name: 'settings',
    title: 'section.settings',
    image: 'settings-menu-inactive.svg',
    activeImage: 'settings-menu.svg',
    route: '/settings',
    children: [{
      name: 'profile',
      title: 'section.profile',
      route: 'settings/profile'
    }, {
      name: 'members',
      title: 'section.members',
      route: 'settings/members',
      children: [{
        name: 'edit',
        title: 'section.membersManage.edit',
        route: 'settings/members'
      }, {
        name: 'create',
        title: 'section.membersManage.create',
        route: 'settings/members/create'
      }]
    }, {
      name: 'devices',
      title: 'section.devices',
      route: 'settings/devices'
    }, {
      name: 'commons',
      title: 'section.commons',
      route: 'settings/commons',
      children: [{
        name: 'edit',
        title: 'section.commonsManage.edit',
        route: 'settings/commons'
      }, {
        name: 'create',
        title: 'section.commonsManage.new',
        route: 'settings/commons/create'
      }, {
        name: 'join',
        title: 'section.commonsManage.join',
        route: 'settings/commons/join'
      }]
    }]
  }],
  DEVICE_TYPES: [{
    id: 'METER',
    title: 'devices.meter',
    image: 'water-meter.svg'
  }, {
    id: 'AMPHIRO',
    title: 'devices.amphiros',
    image: 'amphiro_small.svg'
  }],
  MODES: {
    AMPHIRO: [{
      id: 'stats',
      title: 'history.stats'
    }],
    METER: [{
      id: 'stats',
      title: 'history.volume',
      image: 'volume.svg'
    }, {
      id: 'forecasting',
      title: 'history.forecast',
      image: 'stats.svg'
    }, {
      id: 'pricing',
      title: 'history.cost',
      image: 'money-navy.svg',
      periods: ['month']
    },
    /*
    {
      id: 'breakdown',
      title: 'history.breakdown',
      periods: ['week', 'month', 'year'],
      comparisons: ['last'],
      sort: ['volume'],
      },
      */
    {
      id: 'wateriq',
      title: 'history.wateriq',
      periods: ['year'],
      comparisons: ['all', 'nearest', 'similar'],
      image: 'default-ranking.svg'
    }]
  },
  METRICS: {
    METER: [{
      id: 'volume',
      title: 'history.volume',
      details: 'history.volumeDetails',
      icon: 'volume.svg'
    }, {
      id: 'forecast',
      title: 'history.forecast',
      details: 'history.forecastDetails',
      icon: 'volume.svg'
    }, {
      id: 'total',
      title: 'history.total',
      details: 'history.totalDetails',
      icon: 'volume.svg'
    }, {
      id: 'wateriq',
      title: 'history.wateriq',
      details: 'history.wateriqDetails',
      icon: 'default-ranking.svg'
    }, {
      id: 'cost',
      title: 'history.cost',
      details: 'history.costDetails',
      icon: 'money-navy.svg'
    }],
    AMPHIRO: [{
      id: 'deviceName',
      title: 'history.device',
      icon: 'amphiro_small.svg',
      details: 'history.durationDetails'
    }, {
      id: 'volume',
      title: 'history.volume',
      details: 'history.volumeDetails',
      icon: 'volume.svg',
      clickable: true
    }, {
      id: 'temperature',
      title: 'history.temperature',
      details: 'history.temperatureDetails',
      icon: 'temperature.svg',
      clickable: true
    }, {
      id: 'energy',
      title: 'history.energy',
      details: 'history.energyDetails',
      icon: 'energy.svg'
    }, {
      id: 'duration',
      title: 'history.duration',
      details: 'history.durationDetails',
      icon: 'duration.svg'
    }]
  },
  PERIODS: {
    METER: [{
      id: 'day',
      title: 'periods.day'
    }, {
      id: 'week',
      title: 'periods.week'
    }, {
      id: 'month',
      title: 'periods.month'
    }, {
      id: 'year',
      title: 'periods.year'
    }, {
      id: 'custom',
      title: 'periods.custom'
    }],
    AMPHIRO: [{
      id: 'ten',
      title: 'periods.ten'
    }, {
      id: 'twenty',
      title: 'periods.twenty'
    }, {
      id: 'fifty',
      title: 'periods.fifty'
    }, {
      id: 'all',
      title: 'periods.all'
    }]
  },
  FILTER_METRICS: {
    METER: [{
      id: 'volume',
      title: 'history.volume',
      image: 'volume.svg'
    }, {
      id: 'total',
      title: 'history.total',
      image: 'volume.svg'
    }],
    AMPHIRO: [{
      id: 'volume',
      title: 'history.volume',
      image: 'volume.svg'
    }, {
      id: 'energy',
      title: 'history.energy',
      image: 'energy.svg'
    }, {
      id: 'duration',
      title: 'history.duration',
      image: 'duration.svg'
    }, {
      id: 'temperature',
      title: 'history.temperature',
      image: 'temperature.svg'
    }]
  },
  SORT: {
    METER: [{
      id: 'timestamp',
      title: 'common.time'
    }, {
      id: 'volume',
      title: 'history.volume'
    }],
    AMPHIRO: [{
      id: 'id',
      title: 'history.id'
    }, {
      id: 'timestamp',
      title: 'common.time'
    }, {
      id: 'volume',
      title: 'history.volume'
    }, {
      id: 'energy',
      title: 'history.energy'
    }, {
      id: 'temperature',
      title: 'history.temperature'
    }, {
      id: 'duration',
      title: 'history.duration'
    }]
  },
  COMMONS_USER_SORT: [{
    id: 'FIRSTNAME',
    title: 'profile.firstname'
  }, {
    id: 'LASTNAME',
    title: 'profile.lastname'
  }, {
    id: 'DATE_JOINED',
    title: 'commons.date-joined'
  }],
  STATBOX_DISPLAYS: [{
    id: 'stat',
    title: 'widget.display-stat'
  }, {
    id: 'chart',
    title: 'widget.display-chart'
  }],
  WIDGET_TYPES: {
    AMPHIRO: [{
      id: 'totalVolumeStatAmphiro',
      type: 'total',
      metric: 'volume',
      display: 'stat',
      period: 'ten',
      image: 'totalVolumeStatAmphiro.png'
    }, {
      id: 'totalEnergyStat',
      type: 'total',
      metric: 'energy',
      display: 'stat',
      period: 'ten',
      image: 'totalEnergyStat.png'
    }, {
      id: 'totalTemperatureStat',
      type: 'total',
      metric: 'temperature',
      display: 'stat',
      period: 'ten',
      image: 'totalTemperatureStat.png'
    }, {
      id: 'totalVolumeChartAmphiro',
      type: 'total',
      metric: 'volume',
      display: 'chart',
      period: 'ten',
      image: 'totalVolumeChartAmphiro.png'
    }, {
      id: 'totalEnergyChart',
      type: 'total',
      metric: 'energy',
      display: 'chart',
      period: 'ten',
      image: 'totalEnergyChart.png'
    }, {
      id: 'totalTemperatureChart',
      type: 'total',
      metric: 'temperature',
      display: 'chart',
      period: 'ten',
      image: 'totalTemperatureChart.png'
    }, {
      id: 'last',
      type: 'last',
      metric: 'volume',
      display: 'chart',
      period: 'ten',
      image: 'last.png'
    }, {
      id: 'ranking',
      type: 'ranking',
      metric: 'volume',
      display: 'chart',
      period: 'all',
      image: 'ranking.png'
    }, {
      id: 'efficiencyEnergy',
      type: 'efficiency',
      metric: 'energy',
      display: 'stat',
      period: 'ten',
      image: 'efficiency.png'
    }],
    METER: [{
      id: 'totalVolumeStatSWM',
      type: 'total',
      metric: 'volume',
      display: 'stat',
      period: 'month',
      image: 'totalVolumeStatSWM.png'
    }, {
      id: 'wateriqStat',
      type: 'wateriq',
      metric: 'volume',
      display: 'stat',
      period: 'month',
      periodIndex: -1,
      image: 'wateriqStat.png'
    }, {
      id: 'tip',
      type: 'tip',
      display: 'stat',
      image: 'tip.png'
    }, {
      id: 'totalVolumeChartSWM',
      type: 'total',
      metric: 'volume',
      display: 'chart',
      period: 'month',
      image: 'totalVolumeChartSWM.png'
    }, {
      id: 'wateriqChart',
      type: 'wateriq',
      metric: 'volume',
      display: 'chart',
      period: 'month',
      periodIndex: -1,
      image: 'wateriqChart.png'
    }, {
      id: 'breakdown',
      type: 'breakdown',
      metric: 'volume',
      display: 'chart',
      period: 'month',
      image: 'breakdown.png'
    }, {
      id: 'forecast',
      type: 'forecast',
      metric: 'volume',
      display: 'chart',
      period: 'year',
      image: 'forecast.png'
    }, {
      id: 'pricing',
      type: 'pricing',
      metric: 'total',
      display: 'chart',
      period: 'month',
      image: 'pricing.png'
    }, {
      id: 'comparison',
      type: 'comparison',
      metric: 'volume',
      display: 'chart',
      period: 'month',
      periodIndex: -1,
      image: 'comparison.png'
    },
    /*
    {
      id: 'budget', 
      type: 'budget', 
      metric: 'volume', 
      display: 'chart', 
      period: 'month',
      },
      */
    {
      id: 'commons',
      type: 'commons',
      metric: 'volume',
      display: 'chart',
      period: 'year',
      image: 'common.png'
    }]
  },
  HEATING_SYSTEMS: ['electricity', 'oil', 'gas'],
  SYSTEM_UNITS: ['METRIC', 'IMPERIAL'],
  AMPHIRO_PROPERTIES: [{
    id: 'heating-system',
    type: 'select',
    options: [0, 1, 2]
  }, {
    id: 'heating-efficiency',
    type: 'input',
    options: {
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    }
  }, {
    id: 'cost-energy',
    type: 'input',
    options: {
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    }
  }, {
    id: 'cost-water',
    type: 'input',
    options: {
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1
    }
  }, {
    id: 'share-of-solar',
    type: 'input',
    options: {
      type: 'number',
      min: 0,
      max: 100,
      step: 1
    }
  }]
};