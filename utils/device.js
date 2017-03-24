const { DEVICE_TYPES, AMPHIRO_PROPERTIES } = require('../constants/HomeConstants');

const getAvailableDevices = function (devices) {
  if (!devices) return [];
  return devices.filter(device => device.type === 'AMPHIRO');
};

const getAvailableMeters = function (devices) {
  if (!devices) return [];
  return devices.filter(device => device.type === 'METER');
};

const getDefaultDevice = function (devices) {
  const amphiroDevices = getAvailableDevices(devices);
  const meters = getAvailableMeters(devices);

  if (amphiroDevices && amphiroDevices.length) {
    return amphiroDevices[0];
  } else if (meters && meters.length) {
    return meters[0];
  }
  return null;
};

const getDeviceByKey = function (devices, key) {
  // TODO: if !key added below error is thrown, why?
  // if (!devices ||!Array.isArray(devices)) 
  // throw new Error (`devices ${devices} must be of type array`);
  if (!devices || !Array.isArray(devices)) return {};
  return devices.find(device => device.deviceKey === key);
};

const getDeviceTypeByKey = function (devices, key) {
  const device = getDeviceByKey(devices, key);
  if (!device) return null;
  return device.type;
};

const getDeviceKeyByName = function (devices, name) {
  const device = devices.find(d => d.name === name || d.serial === name);
  if (device) return device.deviceKey;
  return null;
};

const getDeviceCount = function (devices) {
  if (!devices || !devices.length) return 0;
  return getAvailableDevices(devices).length;
};

const getMeterCount = function (devices) {
  if (!devices || !devices.length) return 0;
  return getAvailableMeters(devices).length;
};

const getDeviceKeysByType = function (devices, type) {
  let available = [];
  if (type === 'AMPHIRO') available = getAvailableDevices(devices);
  else if (type === 'METER') available = getAvailableMeters(devices);
  else throw new Error('device type ', type, 'not supported');

  return available.map(d => d.deviceKey);
};

const getAvailableDeviceKeys = function (devices) {
  if (!devices) return [];
  return getAvailableDevices(devices).map(device => device.deviceKey);
};

const getDeviceNameByKey = function (devices, key) {
  const device = getDeviceByKey(devices, key);
  if (!device) return null;
  return device.name || device.serial || device.macAddress || device.deviceKey;
};

const filterDataByDeviceKeys = function (data, deviceKeys) {
  return data.filter(x => deviceKeys.findIndex(k => k === x.deviceKey) > -1);
};

const getDeviceProperty = function (properties, key) {
  if (!Array.isArray(properties)) {
    throw new Error('Properties argument provided to getDeviceProperty needs to be array');
  }
  const property = properties.find(p => p.key === key);
  if (!property) {
    throw new Error(`Requested property ${key} does not exist in properties array`);
  }
  return property.value;
};

const deviceToDeviceForm = function (device) {
  const { name, type, deviceKey, unit, serial, macAddress, 
    registeredOn, properties } = device;
  return {
    type,
    key: deviceKey,
    unit,
    serial,
    registeredOn,
    macAddress,
    ...(type === 'AMPHIRO' ? {
        name,
        ...AMPHIRO_PROPERTIES
        .map(p => p.id)
        .reduce((p, c) => {
          const d = { ...p };
          d[c] = getDeviceProperty(properties, c);
          return d;
        }, {})
      }
      : {})
  };
};

const deviceFormToDevice = function (deviceForm) {
  const { name, type, key, unit } = deviceForm;
  return {
    name,
    type,
    key,
    unit,
    properties: type === 'AMPHIRO' ? AMPHIRO_PROPERTIES.map(p => ({ key: p.id, value: deviceForm[p.id] })) : [],
  };
};

const getAvailableDeviceTypes = function (devices) {
  const meterCount = getMeterCount(devices);
  const deviceCount = getDeviceCount(devices);

  return DEVICE_TYPES
  .filter(type => meterCount === 0 ? type.id !== 'METER' : true)
  .filter(type => deviceCount === 0 ? type.id !== 'AMPHIRO' : true);
};

module.exports = {
  getDefaultDevice,
  getDeviceTypeByKey,
  getDeviceCount,
  getMeterCount,
  getAvailableDevices,
  getAvailableDeviceKeys,
  getAvailableMeters,
  getDeviceNameByKey,
  getDeviceByKey,
  getDeviceKeyByName,
  getDeviceKeysByType,
  filterDataByDeviceKeys,
  deviceToDeviceForm,
  deviceFormToDevice,
  getAvailableDeviceTypes,
};
