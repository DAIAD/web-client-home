'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Query Actions module.
 * A collection of reusable action thunks 
 * that unify query calls handling,
 * regarding loading state and errors.
 * 
 * @module QueryActions
 */
var moment = require('moment');

var types = require('../../constants/ActionTypes');

var sessionUtils = require('../../utils/sessions');
var genUtils = require('../../utils/general');
var timeUtils = require('../../utils/time');

var connectActionsToQueryBackend = function connectActionsToQueryBackend(QueryBackend) {
  var requestedQuery = function requestedQuery() {
    return {
      type: types.QUERY_REQUEST_START
    };
  };

  var receivedQuery = function receivedQuery(success, errors) {
    return {
      type: types.QUERY_REQUEST_END,
      success: success,
      errors: errors
    };
  };

  var setSuccess = function setSuccess() {
    return {
      type: types.QUERY_SET_SUCCESS
    };
  };

  var resetSuccess = function resetSuccess() {
    return {
      type: types.QUERY_RESET_SUCCESS
    };
  };

  var setError = function setError(error) {
    return {
      type: types.QUERY_SET_ERROR,
      error: error
    };
  };

  /**
  * Dismiss error after acknowledgement
  */
  var dismissError = function dismissError() {
    return {
      type: types.QUERY_DISMISS_ERROR
    };
  };

  var setInfo = function setInfo(info) {
    return {
      type: types.QUERY_SET_INFO,
      info: info
    };
  };

  /**
  * Dismiss info after acknowledgement
  */
  var dismissInfo = function dismissInfo() {
    return {
      type: types.QUERY_DISMISS_INFO
    };
  };

  var queryData = function queryData(options) {
    return function (dispatch, getState) {
      var time = options.time,
          population = options.population,
          source = options.source,
          metrics = options.metrics;

      return dispatch(QueryBackend.queryData({
        time: timeUtils.convertOldTimeObject(time),
        population: population,
        source: source,
        metrics: metrics
      }));
    };
  };

  var queryDataAverage = function queryDataAverage(options) {
    return function (dispatch, getState) {
      var time = options.time,
          population = options.population,
          source = options.source;

      return dispatch(queryData({
        time: time,
        population: population,
        source: source,
        metrics: ['AVERAGE']
      })).then(function (response) {
        return source === 'METER' ? response.meters : response.devices;
      }).then(function (sessions) {
        return sessions.map(function (session) {
          return session.points.map(function (p) {
            return _extends({}, p, {
              volume: p.volume.AVERAGE || p.volume.SUM
            });
          });
        });
      });
    };
  };

  var queryMeterForecast = function queryMeterForecast(options) {
    return function (dispatch, getState) {
      var time = options.time,
          userKey = options.userKey;

      if (!time || !time.startDate || !time.endDate || time.granularity == null) {
        throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 'time object with startDate, endDate and granularity');
      }
      return dispatch(QueryBackend.queryMeterForecast({
        time: timeUtils.convertOldTimeObject(time),
        population: [{
          type: 'USER',
          users: [userKey]
        }]
      })).then(function (sessions) {
        return sessions[0].points.map(function (session) {
          return _extends({}, session, {
            volume: session.volume.SUM
          });
        });
      });
    };
  };

  var queryDeviceSessions = function queryDeviceSessions(options) {
    return function (dispatch, getState) {
      var length = options.length,
          deviceKey = options.deviceKey,
          userKey = options.userKey,
          _options$memberFilter = options.memberFilter,
          memberFilter = _options$memberFilter === undefined ? 'all' : _options$memberFilter,
          _options$index = options.index,
          index = _options$index === undefined ? 0 : _options$index;


      if (!length) {
        throw new Error('Not sufficient data provided for device sessions query');
      }
      var members = genUtils.memberFilterToMembers(memberFilter);
      var startIndex = -1 * index * length;

      return dispatch(QueryBackend.queryDeviceSessions(_extends({}, options, {
        type: 'SLIDING',
        members: members,
        memberFilter: memberFilter,
        startIndex: startIndex
      }))).then(function (sessions) {
        return sessions.map(function (session) {
          return _extends({}, session, {
            range: session.sessions ? sessionUtils.getShowerRange(session.sessions) : {}
          });
        });
      });
    };
  };

  var fetchDeviceSession = function fetchDeviceSession(options) {
    return function (dispatch, getState) {
      var id = options.id,
          deviceKey = options.deviceKey;


      if (!id || !deviceKey) {
        throw new Error('Not sufficient data provided for device session fetch: id: ' + id + ', deviceKey:' + deviceKey);
      }
      return dispatch(QueryBackend.fetchDeviceSession({
        sessionId: id,
        deviceKey: deviceKey
      }));
    };
  };

  /**
   * Fetch last session for array of devices
   * @param {String} deviceKey - Device keys to query
   * @return {Promise} Resolve returns Object containing last session data 
   * for all devices provided (last session between devices is computed using timestamp), 
   * reject returns possible errors
   * 
   */
  var fetchLastDeviceSession = function fetchLastDeviceSession(options) {
    return function (dispatch, getState) {
      return dispatch(queryDeviceSessions(_extends({}, options, { length: 1 }))).then(function (response) {
        var reduced = response.reduce(function (p, c) {
          return [].concat(_toConsumableArray(p), _toConsumableArray(c.sessions.map(function (s) {
            return _extends({}, s, { device: c.deviceKey });
          })));
        }, []);

        // find last between devices
        var lastSession = reduced.reduce(function (curr, prev) {
          return curr.id > prev.id ? curr : prev;
        }, {});

        var device = lastSession.device,
            id = lastSession.id,
            index = lastSession.index,
            timestamp = lastSession.timestamp;


        if (!id) throw new Error('sessionIDNotFound');
        var devSessions = response.find(function (x) {
          return x.deviceKey === device;
        });

        return dispatch(fetchDeviceSession({ id: id, deviceKey: device })).then(function (session) {
          return _extends({}, session, {
            active: [device, id],
            showerId: id,
            device: device,
            data: sessionUtils.updateOrAppendToSession([devSessions], _extends({}, session, { deviceKey: device }))
          });
        }).catch(function (error) {
          throw error;
        });
      });
    };
  };

  /**
   * Query Meter for historic session data
   * @param {Object} options - Query options
   * @param {Array} options.deviceKey - Array of device keys to query
   * @param {Object} options.time - Query time window
   * @param {Number} options.time.startDate - Start timestamp for query
   * @param {Number} options.time.endDate - End timestamp for query
   * @param {Number} options.time.granularity - Granularity for data aggregation. 
   *  One of 0: minute, 1: hour, 2: day, 3: week, 4: month
   * @return {Promise} Resolve returns Object containing meter sessions data 
   *  in form {data: sessionsData}, reject returns possible errors
   * 
   */
  var queryMeterHistory = function queryMeterHistory(options) {
    return function (dispatch, getState) {
      var time = options.time,
          userKey = options.userKey;


      if (!time || !time.startDate || !time.endDate) {
        throw new Error('Not sufficient data provided for meter history query: time: ' + time.startDate + ', ' + time.endDate);
      }

      var data = {
        time: time,
        source: 'METER',
        metrics: ['SUM'],
        population: [{
          type: 'USER',
          users: [userKey]
        }]
      };

      return dispatch(queryDataAverage(data)).then(function (meters) {
        return meters.map(function (sessions) {
          return {
            sessions: sessions
          };
        });
      });
    };
  };

  var queryUserComparisons = function queryUserComparisons(options) {
    return function (dispatch, getState) {
      var month = options.month,
          year = options.year,
          userKey = options.userKey;

      return dispatch(QueryBackend.queryUserComparisons({
        userKey: userKey,
        year: year,
        month: month
      }));
    };
  };

  var queryUserComparisonsByTime = function queryUserComparisonsByTime(options) {
    return function (dispatch, getState) {
      var userKey = options.userKey,
          time = options.time;
      var startDate = time.startDate,
          endDate = time.endDate,
          granularity = time.granularity;


      var endMonth = moment(endDate).month();
      var months = moment(endDate).add(endMonth <= 6 ? 6 - endMonth : 12 - endMonth, 'month').diff(moment(startDate), 'months', true);

      var iters = Math.ceil(months / 6);

      return Promise.all(Array.from({ length: iters }, function (x, i) {
        var currDate = moment(endDate).subtract(i * 6, 'month');
        var month = currDate.month() + 1 <= 6 ? 6 : 12;
        var year = currDate.year();
        return dispatch(queryUserComparisons({ userKey: userKey, month: month, year: year }));
      }));
    };
  };

  var fetchUserComparison = function fetchUserComparison(options) {
    return function (dispatch, getState) {
      var time = options.time,
          userKey = options.userKey,
          comparison = options.comparison;
      var startDate = time.startDate,
          endDate = time.endDate,
          granularity = time.granularity;


      if (granularity !== 2 && granularity !== 4) {
        return Promise.reject('only day, month granularity supported in fetch comparisonByTime');
      }
      return dispatch(queryUserComparisonsByTime({ userKey: userKey, time: time })).then(function (comparisonsArr) {
        return comparisonsArr.map(function (c) {
          if (c === null) {
            return [];
          } else if (granularity === 2) {
            // future compatibility with API response typo fix
            return c.dailyConsumption || c.dailyConsumtpion;
          } else if (granularity === 4) {
            // future compatibility with API response typo fix
            return c.monthlyConsumption || c.monthlyConsumtpion;
          }
          return [];
        });
      }).then(function (sessionsArr) {
        return sessionsArr.reduce(function (p, c) {
          return [].concat(_toConsumableArray(p), _toConsumableArray(c));
        }, []);
      }).then(function (comparisons) {
        return comparisons.map(function (m) {
          return {
            from: m.from,
            to: m.to,
            date: m.date,
            timestamp: granularity === 2 ? moment(m.date).valueOf() : moment(m.from).valueOf(),
            volume: m[comparison]
          };
        });
      }).then(function (sessions) {
        return sessions.filter(function (s) {
          return granularity === 2 ? startDate <= moment(s.date).valueOf() && endDate >= moment(s.date).valueOf() : startDate <= moment(s.from).valueOf() && endDate >= moment(s.to).valueOf();
        });
      });
    };
  };

  var fetchWaterIQ = function fetchWaterIQ(options) {
    return function (dispatch, getState) {
      var time = options.time,
          userKey = options.userKey;
      var startDate = time.startDate,
          endDate = time.endDate;


      return dispatch(queryUserComparisonsByTime({ userKey: userKey, time: time })).then(function (comparisonsArr) {
        return comparisonsArr.map(function (c) {
          return c == null ? [] : c.waterIq;
        });
      }).then(function (sessionsArr) {
        return sessionsArr.reduce(function (p, c) {
          return [].concat(_toConsumableArray(p), _toConsumableArray(c));
        }, []);
      }).then(function (comparisons) {
        return comparisons.map(function (m) {
          return _extends({}, m, {
            user: m.user.value,
            all: m.all.value,
            similar: m.similar.value,
            nearest: m.nearest.value,
            timestamp: moment(m.from).valueOf()
          });
        });
      }).then(function (sessions) {
        return sessions.filter(function (s) {
          return startDate <= moment(s.from).valueOf() && endDate >= moment(s.to).valueOf();
        });
      });
    };
  };

  /**
   ** Fetch data based on provided options and handle query response before returning
   * 
   * @param {Object} options - Options to fetch data 
   * @param {Boolean} options.cache - Whether cache query functions should be called or not 
   * @param {String} options.deviceType - The type of device to query. One of METER, AMPHIRO
   * @param {String} options.period - The period to query.
   *                                  For METER one of day, week, month, year, custom (time-based)
   *                                  for AMPHIRO one of ten, twenty, fifty (index-based)
   * @param {String} options.type - The widget type. One of: 
   *                                total (total metric consumption for period and deviceType),
   *                                last (last shower - only for deviceType AMPHIRO),
   *                                efficiency (energy efficiency for period - 
   *                                  only for deviceType AMPHIRO, metric energy),
   *                                breakdown (Water breakdown analysis for period - 
   *                                  only for deviceType METER, metric difference 
   *                                  (volume difference). Static for the moment),
   *                                forecast (Computed forecasting for period 
   *                                - only for deviceType METER, 
   *                                  metric difference (volume difference). 
   *                                  Static for the moment),
   *                                comparison (Comparison for period and comparison metric 
   *                                - only for deviceType METER. Static for the moment),
   *                                budget (User budget information. Static for the moment)
   *
   */
  var fetchWidgetData = function fetchWidgetData(options) {
    return function (dispatch, getState) {
      var type = options.type,
          userKey = options.userKey,
          deviceType = options.deviceType,
          _options$deviceKey = options.deviceKey,
          deviceKey = _options$deviceKey === undefined ? null : _options$deviceKey,
          period = options.period,
          periodIndex = options.periodIndex,
          members = options.members,
          common = options.common;


      if (!type || !deviceType) {
        console.error('fetchWidgetData: Insufficient data provided (need type, deviceType):', options);
        throw new Error('fetchWidgetData: Insufficient data provided:');
      }

      // if no userKey just return 
      if (!userKey) {
        return Promise.resolve();
      }
      var time = options.time || timeUtils.getTimeByPeriod(period, periodIndex);
      var forecastTime = options.forecastTime || time;

      if (type === 'tip') {
        return Promise.resolve();
      }
      if (deviceType === 'METER') {
        var prevTime = timeUtils.getPreviousPeriodSoFar(period, time.startDate);
        return dispatch(queryMeterHistory({
          userKey: userKey,
          time: time
        })).then(function (data) {
          return { data: data };
        }).then(function (res) {
          if (type === 'total' && prevTime) {
            // fetch previous period data for comparison 
            return dispatch(queryMeterHistory({
              userKey: userKey,
              time: prevTime
            })).then(function (prevData) {
              return _extends({}, res, { previous: prevData, prevTime: prevTime });
            }).catch(function (error) {
              console.error('Caught error in widget previous period data fetch:', error);
            });
          } else if (type === 'forecast') {
            return dispatch(queryMeterForecast({
              userKey: userKey,
              time: forecastTime
            })).then(function (forecastData) {
              return _extends({}, res, { forecastData: forecastData });
            });
          } else if (type === 'comparison') {
            return Promise.all(['similar', 'nearest', 'all', 'user'].map(function (id) {
              return dispatch(fetchUserComparison({
                comparison: id,
                time: time,
                userKey: userKey
              })).then(function (sessions) {
                return { id: id, sessions: sessions };
              });
            })).then(function (comparisons) {
              return _extends({}, res, { comparisons: comparisons });
            });
          } else if (type === 'wateriq') {
            return dispatch(fetchWaterIQ({
              userKey: userKey,
              time: timeUtils.lastSixMonths(time.startDate)
            })).then(function (data) {
              return _extends({}, res, { data: data });
            });
          } else if (type === 'pricing') {
            return res;
          } else if (type === 'breakdown') {
            return res;
          } else if (type === 'commons') {
            if (!common) return Promise.resolve(_extends({}, res, { common: null }));
            return dispatch(queryDataAverage({
              time: time,
              source: 'METER',
              population: [{
                type: 'GROUP',
                group: common.key
              }]
            })).then(function (populations) {
              return Array.isArray(populations) && populations.length > 0 ? populations[0] : [];
            }).then(function (commonData) {
              return _extends({}, res, {
                common: common,
                commonData: commonData
              });
            });
          }
          return Promise.resolve(res);
        });
      } else if (deviceType === 'AMPHIRO') {
        if (type === 'last') {
          return dispatch(fetchLastDeviceSession({
            userKey: userKey,
            deviceKey: deviceKey
          }));
        } else if (type === 'ranking') {
          var activeMembers = genUtils.getAllMembers(members);
          return Promise.all(activeMembers.map(function (m) {
            return dispatch(queryDeviceSessions({
              length: genUtils.showerFilterToLength(period),
              memberFilter: m.index,
              userKey: userKey,
              deviceKey: deviceKey
            })).then(function (memberData) {
              return _extends({ sessions: memberData }, m);
            });
          })).then(function (data) {
            return { data: data };
          });
        }
        return dispatch(queryDeviceSessions({
          length: genUtils.showerFilterToLength(period),
          userKey: userKey,
          deviceKey: deviceKey
        })).then(function (data) {
          return { data: data };
        }).then(function (res) {
          return period !== 'all' ? dispatch(queryDeviceSessions({
            length: genUtils.showerFilterToLength(period),
            deviceKey: deviceKey,
            userKey: userKey,
            index: -1
          })).then(function (prevData) {
            return _extends({}, res, { previous: prevData });
          }) : Promise.resolve(res);
        });
      }
      return Promise.reject(new Error('noDeviceType'));
    };
  };

  return _extends({}, QueryBackend, {
    requestedQuery: requestedQuery,
    receivedQuery: receivedQuery,
    setSuccess: setSuccess,
    resetSuccess: resetSuccess,
    setError: setError,
    dismissError: dismissError,
    setInfo: setInfo,
    dismissInfo: dismissInfo,
    queryData: queryData,
    queryDataAverage: queryDataAverage,
    queryMeterForecast: queryMeterForecast,
    queryDeviceSessions: queryDeviceSessions,
    fetchDeviceSession: fetchDeviceSession,
    fetchLastDeviceSession: fetchLastDeviceSession,
    queryMeterHistory: queryMeterHistory,
    queryUserComparisons: queryUserComparisons,
    fetchUserComparison: fetchUserComparison,
    fetchWaterIQ: fetchWaterIQ,
    fetchWidgetData: fetchWidgetData
  });
};

module.exports = connectActionsToQueryBackend;