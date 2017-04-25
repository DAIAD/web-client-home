'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../constants/HomeConstants'),
    DEVICE_TYPES = _require.DEVICE_TYPES,
    AMPHIRO_PROPERTIES = _require.AMPHIRO_PROPERTIES;

var getAvailableDevices = function getAvailableDevices(devices) {
  if (!devices) return [];
  return devices.filter(function (device) {
    return device.type === 'AMPHIRO';
  });
};

var getAvailableMeters = function getAvailableMeters(devices) {
  if (!devices) return [];
  return devices.filter(function (device) {
    return device.type === 'METER';
  });
};

var getDefaultDevice = function getDefaultDevice(devices) {
  var amphiroDevices = getAvailableDevices(devices);
  var meters = getAvailableMeters(devices);

  if (amphiroDevices && amphiroDevices.length) {
    return amphiroDevices[0];
  } else if (meters && meters.length) {
    return meters[0];
  }
  return null;
};

var getDeviceByKey = function getDeviceByKey(devices, key) {
  // TODO: if !key added below error is thrown, why?
  // if (!devices ||!Array.isArray(devices)) 
  // throw new Error (`devices ${devices} must be of type array`);
  if (!devices || !Array.isArray(devices)) return {};
  return devices.find(function (device) {
    return device.deviceKey === key;
  });
};

var getDeviceTypeByKey = function getDeviceTypeByKey(devices, key) {
  var device = getDeviceByKey(devices, key);
  if (!device) return null;
  return device.type;
};

var getDeviceKeyByName = function getDeviceKeyByName(devices, name) {
  var device = devices.find(function (d) {
    return d.name === name || d.serial === name;
  });
  if (device) return device.deviceKey;
  return null;
};

var getDeviceCount = function getDeviceCount(devices) {
  if (!devices || !devices.length) return 0;
  return getAvailableDevices(devices).length;
};

var getMeterCount = function getMeterCount(devices) {
  if (!devices || !devices.length) return 0;
  return getAvailableMeters(devices).length;
};

var getDeviceKeysByType = function getDeviceKeysByType(devices, type) {
  var available = [];
  if (type === 'AMPHIRO') available = getAvailableDevices(devices);else if (type === 'METER') available = getAvailableMeters(devices);else throw new Error('device type ', type, 'not supported');

  return available.map(function (d) {
    return d.deviceKey;
  });
};

var getAvailableDeviceKeys = function getAvailableDeviceKeys(devices) {
  if (!devices) return [];
  return getAvailableDevices(devices).map(function (device) {
    return device.deviceKey;
  });
};

var getDeviceNameByKey = function getDeviceNameByKey(devices, key) {
  var device = getDeviceByKey(devices, key);
  if (!device) return null;
  return device.name || device.serial || device.macAddress || device.deviceKey;
};

var getDeviceProperty = function getDeviceProperty(properties, key) {
  if (!Array.isArray(properties)) {
    throw new Error('Properties argument provided to getDeviceProperty needs to be array');
  }
  var property = properties.find(function (p) {
    return p.key === key;
  });
  if (!property) {
    throw new Error('Requested property ' + key + ' does not exist in properties array');
  }
  return property.value;
};

var deviceToDeviceForm = function deviceToDeviceForm(device) {
  var name = device.name,
      type = device.type,
      deviceKey = device.deviceKey,
      unit = device.unit,
      serial = device.serial,
      macAddress = device.macAddress,
      registeredOn = device.registeredOn,
      properties = device.properties;

  return _extends({
    type: type,
    key: deviceKey,
    unit: unit,
    serial: serial,
    registeredOn: registeredOn,
    macAddress: macAddress
  }, type === 'AMPHIRO' ? _extends({
    name: name
  }, AMPHIRO_PROPERTIES.map(function (p) {
    return p.id;
  }).reduce(function (p, c) {
    var d = _extends({}, p);
    d[c] = getDeviceProperty(properties, c);
    return d;
  }, {})) : {});
};

var deviceFormToDevice = function deviceFormToDevice(deviceForm) {
  var name = deviceForm.name,
      type = deviceForm.type,
      key = deviceForm.key,
      unit = deviceForm.unit;

  return {
    name: name,
    type: type,
    key: key,
    unit: unit,
    properties: type === 'AMPHIRO' ? AMPHIRO_PROPERTIES.map(function (p) {
      return { key: p.id, value: deviceForm[p.id] };
    }) : []
  };
};

var getAvailableDeviceTypes = function getAvailableDeviceTypes(devices) {
  var meterCount = getMeterCount(devices);
  var deviceCount = getDeviceCount(devices);

  return DEVICE_TYPES.filter(function (type) {
    return meterCount === 0 ? type.id !== 'METER' : true;
  }).filter(function (type) {
    return deviceCount === 0 ? type.id !== 'AMPHIRO' : true;
  });
};

module.exports = {
  getDefaultDevice: getDefaultDevice,
  getDeviceTypeByKey: getDeviceTypeByKey,
  getDeviceCount: getDeviceCount,
  getMeterCount: getMeterCount,
  getAvailableDevices: getAvailableDevices,
  getAvailableDeviceKeys: getAvailableDeviceKeys,
  getAvailableMeters: getAvailableMeters,
  getDeviceNameByKey: getDeviceNameByKey,
  getDeviceByKey: getDeviceByKey,
  getDeviceKeyByName: getDeviceKeyByName,
  getDeviceKeysByType: getDeviceKeysByType,
  deviceToDeviceForm: deviceToDeviceForm,
  deviceFormToDevice: deviceFormToDevice,
  getAvailableDeviceTypes: getAvailableDeviceTypes
};