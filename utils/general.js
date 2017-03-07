const { SHOWERS_PAGE } = require('../constants/HomeConstants');

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
const validateEmail = function (email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// flattens nested object
// {a: {a1: '1', a2: '2'}, b: {b1: '1', b2: '2'}} -> 
// {a.a1: '1', a.a2: '2', b.b1: '1', b.b2: '2'}
const flattenMessages = function (nestedMessages, prefix) {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    let d = { ...messages };
    if (typeof value === 'string') {
      d[prefixedKey] = value;
    } else {
      d = { ...d, ...flattenMessages(value, prefixedKey) };
    }
    return d;
  }, {});
};

const addZero = function (input) {
  return input < 10 ? `0${input}` : `${input}`;
};

const getFriendlyDuration = function (seconds) {
  if (!seconds) { return null; }
  
  if (seconds > 3600) {
    return `${addZero(Math.floor(seconds / 3600))}:` +
           `${addZero(Math.floor((seconds % 3600) / 60))}:` +
           `${addZero(Math.floor((seconds % 3600) / 60) % 60)}`;
  } else if (seconds > 60) {
    return `${addZero(Math.floor(seconds / 60))}:` +
      `${addZero(Math.floor(seconds / 60) % 60)}`;
  }
  return `00:${addZero(seconds)}`;
};

const getEnergyClass = function (energy) {
  let scale;
  
  if (energy >= 3675) {
    scale = 'G-';
  } else if (energy >= 3500) {
    scale = 'G';
  } else if (energy >= 3325) {
    scale = 'G+';
  } else if (energy >= 3150) {
    scale = 'F-';
  } else if (energy >= 2975) {
    scale = 'F';
  } else if (energy >= 2800) {
    scale = 'F+';
  } else if (energy >= 2625) {
    scale = 'E-';
  } else if (energy >= 2450) {
    scale = 'E';
  } else if (energy >= 2275) {
    scale = 'E+';
  } else if (energy >= 2100) {
    scale = 'D-';
  } else if (energy >= 1925) {
    scale = 'D';
  } else if (energy >= 1750) {
    scale = 'D+';
  } else if (energy >= 1575) {
    scale = 'C-';
  } else if (energy >= 1400) {
    scale = 'C';
  } else if (energy >= 1225) {
    scale = 'C+';
  } else if (energy >= 1050) {
    scale = 'B-';
  } else if (energy >= 875) {
    scale = 'B';
  } else if (energy >= 700) {
    scale = 'B+';
  } else if (energy >= 525) {
    scale = 'A-';
  } else if (energy >= 351) {
    scale = 'A';
  } else if (energy <= 350) {
    scale = 'A+';
  }
  return scale;
};

const getMetricMu = function (metric) {
  if (metric === 'showers') return '';
  else if (metric === 'volume' || metric === 'difference') return 'lt';
  else if (metric === 'energy') return 'kW';
  else if (metric === 'duration') return 'min';
  else if (metric === 'temperature') return '°C';
  throw new Error(`unrecognized metric ${metric}`);
};

const getShowerMetricMu = function (metric) {
  if (metric === 'volume') return 'lt';
  else if (metric === 'energy') return 'W';
  else if (metric === 'temperature') return '°C';
  throw new Error(`unrecognized metric ${metric}`);
};

const showerFilterToLength = function (filter) {
  if (filter === 'ten') return 10;
  else if (filter === 'twenty') return 20;
  else if (filter === 'fifty') return 50;
  else if (filter === 'all') return 5000;
  throw new Error(`unrecognized filter ${filter}`);
};

const getShowersPagingIndex = function (length, index) {
  return Math.floor((length * Math.abs(index)) / SHOWERS_PAGE);
};

const getAmphiroCacheKey = function (length, index) {
  const cacheIdx = -1 * getShowersPagingIndex(length, index);
  return `AMPHIRO,${SHOWERS_PAGE},${cacheIdx}`;
};

const getMeterCacheKey = function (time) {
  return `METER,${time.startDate},${time.endDate}`;
};

const getCacheKey = function (deviceType, ...rest) {
  if (deviceType === 'AMPHIRO') {
    if (rest.length < 2) {
      throw new Error('cant get amphiro cache key without length, index');
    }
    return getAmphiroCacheKey(...rest);
  } else if (deviceType === 'METER') {
    return getMeterCacheKey(...rest);
  }
  throw new Error(`deviceType ${deviceType} not supported`);
};

const uploadFile = function (file, successCb, failureCb) {
  if (!file) return;
  if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    failureCb('fileWrongType');
    return;
  }
  if (file.size > 2048000000) {
    failureCb('fileExceedSize');
    return;
  }
  const reader = new FileReader();

  reader.onload = (upload) => {
    const STR = 'base64,';
    const index = upload.target.result.indexOf(STR);
    successCb(upload.target.result.substring(index + STR.length));
  };

  reader.onerror = (error) => {
    failureCb('fileUploadError');
  };

  reader.readAsDataURL(file);
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
const debounce = function (func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}; 

const getActiveLinks = function (routes) {
  return routes.map(route => route.path || route.default); 
};

const getActiveKey = function (routes, depth) {
  const active = getActiveLinks(routes);
  if (active != null && active.length > 0) {
    return active[depth].split('/')[0];
  }
  return null;
};

const filterObj = function (obj, included) {
  return Object.keys(obj)
  .filter(k => included.includes(k))
  .reduce((p, c) => {
    const n = { ...p };
    n[c] = obj[c];
    return n;
  }, {});
};

const throwServerError = function (response) {
  if (response.status === 401 || response.status === 403) {
    throw new Error('unauthorized');
  } else if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].code);
  }
  throw new Error('unknownError');
};

const formatMessage = function (intl) {
  return function (x, rest) {
    return intl.formatMessage({ id: x }, rest);
  };
};

module.exports = {
  validateEmail,
  flattenMessages,
  getFriendlyDuration,
  getEnergyClass,
  getMetricMu,
  getShowerMetricMu,
  showerFilterToLength,
  getCacheKey,
  getShowersPagingIndex,
  debounce,
  uploadFile,
  getActiveKey,
  filterObj,
  throwServerError,
  formatMessage,
};
