'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../constants/HomeConstants'),
    SHOWERS_PAGE = _require.SHOWERS_PAGE,
    VOLUME_BOTTLE = _require.VOLUME_BOTTLE,
    VOLUME_BUCKET = _require.VOLUME_BUCKET,
    VOLUME_POOL = _require.VOLUME_POOL,
    ENERGY_BULB = _require.ENERGY_BULB,
    ENERGY_HOUSE = _require.ENERGY_HOUSE,
    ENERGY_CITY = _require.ENERGY_CITY;

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript


var validateEmail = function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// flattens nested object
// {a: {a1: '1', a2: '2'}, b: {b1: '1', b2: '2'}} -> 
// {a.a1: '1', a.a2: '2', b.b1: '1', b.b2: '2'}
var flattenMessages = function flattenMessages(nestedMessages, prefix) {
  return Object.keys(nestedMessages).reduce(function (messages, key) {
    var value = nestedMessages[key];
    var prefixedKey = prefix ? prefix + '.' + key : key;

    var d = _extends({}, messages);
    if (typeof value === 'string') {
      d[prefixedKey] = value;
    } else {
      d = _extends({}, d, flattenMessages(value, prefixedKey));
    }
    return d;
  }, {});
};

var addZero = function addZero(input) {
  return input < 10 ? '0' + input : '' + input;
};

var getFriendlyDuration = function getFriendlyDuration(seconds) {
  if (!seconds) {
    return null;
  }

  if (seconds > 3600) {
    return addZero(Math.floor(seconds / 3600)) + 'h ' + (addZero(Math.floor(seconds % 3600 / 60)) + '\' ') + (addZero(Math.floor(seconds % 3600 / 60) % 60) + '"');
  } else if (seconds > 60) {
    return addZero(Math.floor(seconds / 60)) + '\' ' + (addZero(Math.floor(seconds / 60) % 60) + '"');
  }
  return '00:' + addZero(seconds);
};

var getEnergyClass = function getEnergyClass(energy) {
  var scale = void 0;

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

var getMetricMu = function getMetricMu(metric) {
  if (metric === 'showers') return '';else if (metric === 'volume' || metric === 'difference' || metric === 'total' || metric === 'forecast') return 'lt';
  //else if (metric === 'total' || metric === 'volumeCubic') return '\u33A5';
  else if (metric === 'energy') return 'kWh';else if (metric === 'duration') return 'min';else if (metric === 'temperature') return '°C';else if (metric === 'cost') return '\u20AC';
  return '';
  //throw new Error(`unrecognized metric ${metric}`);
};

var getShowerMetricMu = function getShowerMetricMu(metric) {
  if (metric === 'volume') return 'lt';else if (metric === 'energy') return 'W';else if (metric === 'temperature') return '°C';
  throw new Error('unrecognized metric ' + metric);
};

var showerFilterToLength = function showerFilterToLength(filter) {
  if (filter === 'ten') return 10;else if (filter === 'twenty') return 20;else if (filter === 'fifty') return 50;else if (filter === 'all') return 5000;
  throw new Error('unrecognized filter ' + filter);
};

var getShowersPagingIndex = function getShowersPagingIndex(length, index) {
  return Math.floor(length * Math.abs(index) / SHOWERS_PAGE);
};

var uploadFile = function uploadFile(file, successCb, failureCb) {
  if (!file) return;
  if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    failureCb('fileWrongType');
    return;
  }
  if (file.size > 2048000000) {
    failureCb('fileExceedSize');
    return;
  }
  var reader = new FileReader();

  reader.onload = function (upload) {
    var STR = 'base64,';
    var index = upload.target.result.indexOf(STR);
    successCb(upload.target.result.substring(index + STR.length));
  };

  reader.onerror = function (error) {
    failureCb('fileUploadError');
  };

  reader.readAsDataURL(file);
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this;
    var args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var getActiveLinks = function getActiveLinks(routes) {
  return routes.map(function (route) {
    return route.path || route.default;
  });
};

var getActiveKey = function getActiveKey(routes, depth) {
  var active = getActiveLinks(routes);
  if (active != null && active.length > 0) {
    return active[depth].split('/')[0];
  }
  return null;
};

var filterObj = function filterObj(obj, included) {
  return Object.keys(obj).filter(function (k) {
    return included.includes(k);
  }).reduce(function (p, c) {
    var n = _extends({}, p);
    n[c] = obj[c];
    return n;
  }, {});
};

var throwServerError = function throwServerError(response) {
  if (response.status === 401 || response.status === 403) {
    throw new Error('unauthorized');
  } else if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].code);
  }
  throw new Error('unknownError');
};

var formatMessage = function formatMessage(intl) {
  return function (x, rest) {
    return intl.formatMessage({ id: x }, rest);
  };
};

var validatePassword = function validatePassword(password, confirmPassword) {
  if (!password) {
    return Promise.reject('noPassword');
  } else if (password !== confirmPassword) {
    return Promise.reject('passwordMismatch');
  } else if (password.length < 8) {
    return Promise.reject('passwordTooShort');
  }
  return Promise.resolve();
};

var tableToCSV = function tableToCSV(schema, data) {
  var fields = schema.filter(function (field) {
    return field.csv !== false;
  });
  return data.map(function (row) {
    return fields.map(function (field) {
      return row[field.id];
    }).join('%2C');
  }).reduce(function (p, c) {
    return [p, c].join('%0A');
  }, fields.map(function (field) {
    return field.name;
  }).join(', '));
};

// Estimates how many bottles/buckets/pools the given volume corresponds to
// The remaining is provided in quarters
var volumeToPictures = function volumeToPictures(volume) {
  var div = function div(c) {
    return Math.floor(volume / c);
  };
  var rem = function rem(c) {
    return Math.floor(4 * (volume % c) / c) / 4;
  };
  if (volume < VOLUME_BUCKET) {
    return {
      display: 'bottle',
      items: div(VOLUME_BOTTLE),
      remaining: rem(VOLUME_BOTTLE)
    };
  } else if (volume < VOLUME_POOL) {
    return {
      display: 'bucket',
      items: div(VOLUME_BUCKET),
      remaining: rem(VOLUME_BUCKET)
    };
  }
  return {
    display: 'pool',
    items: div(VOLUME_POOL),
    remaining: 0
  };
};

var energyToPictures = function energyToPictures(energy) {
  var div = function div(c) {
    return Math.floor(energy / c);
  };

  if (energy < ENERGY_HOUSE) {
    return {
      display: 'light-bulb',
      items: div(ENERGY_BULB)
    };
  } else if (energy < ENERGY_CITY) {
    return {
      display: 'home-energy',
      items: div(ENERGY_HOUSE)
    };
  }
  return {
    display: 'city',
    items: div(ENERGY_CITY)
  };
};
var getAllMembers = function getAllMembers(members) {
  if (!Array.isArray(members)) return [];
  return members.filter(function (member) {
    return member.active || member.index === 0;
  });
};

var memberFilterToMembers = function memberFilterToMembers(filter) {
  if (filter === 'all') {
    return [];
  } else if (!isNaN(filter)) {
    return [filter];
  }
  return [];
};

var waterIQToNumeral = function waterIQToNumeral(waterIQ) {
  return 5 - (String(waterIQ).charCodeAt(0) - 65);
};

var numeralToWaterIQ = function numeralToWaterIQ(num) {
  if (num < 0 || num > 5) return ' ';
  return String.fromCharCode(5 - num + 65);
};

module.exports = {
  validateEmail: validateEmail,
  flattenMessages: flattenMessages,
  getFriendlyDuration: getFriendlyDuration,
  getEnergyClass: getEnergyClass,
  getMetricMu: getMetricMu,
  getShowerMetricMu: getShowerMetricMu,
  showerFilterToLength: showerFilterToLength,
  getShowersPagingIndex: getShowersPagingIndex,
  debounce: debounce,
  uploadFile: uploadFile,
  getActiveKey: getActiveKey,
  filterObj: filterObj,
  throwServerError: throwServerError,
  formatMessage: formatMessage,
  validatePassword: validatePassword,
  tableToCSV: tableToCSV,
  energyToPictures: energyToPictures,
  volumeToPictures: volumeToPictures,
  getAllMembers: getAllMembers,
  memberFilterToMembers: memberFilterToMembers,
  waterIQToNumeral: waterIQToNumeral,
  numeralToWaterIQ: numeralToWaterIQ
};