/**
 * Query Actions module.
 * A collection of reusable action thunks 
 * that unify query calls handling,
 * regarding loading state and errors.
 * 
 * @module QueryActions
 */

const moment = require('moment');

const types = require('../../constants/ActionTypes');

const sessionUtils = require('../../utils/sessions');
const genUtils = require('../../utils/general');
const timeUtils = require('../../utils/time');

const connectActionsToQueryBackend = function (QueryBackend) { 
  const requestedQuery = function () {
    return {
      type: types.QUERY_REQUEST_START,
    };
  };

  const receivedQuery = function (success, errors) {
    return {
      type: types.QUERY_REQUEST_END,
      success,
      errors,
    };
  };

  const resetSuccess = function () {
    return {
      type: types.QUERY_RESET_SUCCESS,
    };
  };

  const setError = function (error) {
    return {
      type: types.QUERY_SET_ERROR,
      error,
    };
  };

   /**
   * Dismiss error after acknowledgement
   */
  const dismissError = function () {
    return {
      type: types.QUERY_DISMISS_ERROR,
    };
  };

  const setInfo = function (info) {
    return {
      type: types.QUERY_SET_INFO,
      info,
    };
  };

   /**
   * Dismiss info after acknowledgement
   */
  const dismissInfo = function () {
    return {
      type: types.QUERY_DISMISS_INFO,
    };
  };

  const queryData = function (options) {
    return function (dispatch, getState) {
      const { time, population, source, metrics } = options;
      return dispatch(QueryBackend.queryData({
        time: timeUtils.convertOldTimeObject(time),
        population, 
        source,
        metrics,
      }));
    };
  };

  const queryDataAverage = function (options) {
    return function (dispatch, getState) {
      const { time, population, source } = options;
      return dispatch(queryData({
        time,
        population,
        source,
        metrics: ['AVERAGE'],
      }))
      .then(response => source === 'METER' ? response.meters : response.devices)
      .then(sessions => sessions.map(session => session.points.map(p => ({ 
        ...p, 
        volume: p.volume.AVERAGE || p.volume.SUM, 
      }))));
    };
  };

  const queryMeterForecast = function (options) {
    return function (dispatch, getState) {
      const { time, userKey } = options;
      if (!time || !time.startDate || !time.endDate || time.granularity == null) {
        throw new Error('Not sufficient data provided for meter forecast query. Requires: \n' + 
                        'time object with startDate, endDate and granularity');
      }
      return dispatch(QueryBackend.queryMeterForecast({
        time: timeUtils.convertOldTimeObject(time),
        population: [{
          type: 'USER',
          users: [userKey],
        }],
      }))
      .then(sessions => sessions[0].points.map(session => ({ 
        ...session, 
        volume: session.volume.SUM 
      })));
    };
  };

  const queryDeviceSessions = function (options) {
    return function (dispatch, getState) {
      const { length, deviceKey, userKey, memberFilter = 'all', index = 0 } = options;

      if (!length) {
        throw new Error('Not sufficient data provided for device sessions query');
      }
      const members = genUtils.memberFilterToMembers(memberFilter);
      const startIndex = -1 * index * length;

      return dispatch(QueryBackend.queryDeviceSessions({
        ...options,
        type: 'SLIDING',
        members,
        memberFilter,
        startIndex,
      }))
      .then(sessions => sessions.map(session => ({ 
        ...session,
        range: session.sessions ? sessionUtils.getShowerRange(session.sessions) : {}
      })));
    };
  };

  const fetchDeviceSession = function (options) {
    return function (dispatch, getState) {
      const { id, deviceKey } = options;

      if (!id || !deviceKey) {
        throw new Error(`Not sufficient data provided for device session fetch: id: ${id}, deviceKey:${deviceKey}`);
      }
      return dispatch(QueryBackend.fetchDeviceSession({
        sessionId: id, 
        deviceKey,
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
  const fetchLastDeviceSession = function (options) {
    return function (dispatch, getState) {
      return dispatch(queryDeviceSessions({ ...options, length: 1 }))
      .then((response) => {
        const reduced = response.reduce((p, c) => [...p, ...c.sessions.map(s => ({ ...s, device: c.deviceKey }))], []);

        // find last between devices
        const lastSession = reduced.reduce((curr, prev) => 
          ((curr.id > prev.id) ? curr : prev), {}); 

        const { device, id, index, timestamp } = lastSession;

        if (!id) throw new Error('sessionIDNotFound');
        const devSessions = response.find(x => x.deviceKey === device);

        return dispatch(fetchDeviceSession({ id, deviceKey: device }))
        .then(session => ({ 
          ...session,
          active: [device, id],
          showerId: id,
          device,
          data: sessionUtils.updateOrAppendToSession([devSessions], { ...session, deviceKey: device }), 
          }))
        .catch((error) => { throw error; });
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
  const queryMeterHistory = function (options) {
    return function (dispatch, getState) {
      const { time, userKey } = options;
      
      if (!time || !time.startDate || !time.endDate) {
        throw new Error(`Not sufficient data provided for meter history query: time: ${time.startDate}, ${time.endDate}`);
      }

      const data = {
        time,
        source: 'METER',
        metrics: ['SUM'],
        population: [
          {
            type: 'USER',
            users: [userKey],
          },
        ],
      };

      return dispatch(queryDataAverage(data))
      .then(meters => meters.map(sessions => ({
        sessions,
      })));
    };
  };

  const queryUserComparisons = function (options) {
    return function (dispatch, getState) {
      const { month, year, userKey } = options;
      return dispatch(QueryBackend.queryUserComparisons({
        userKey,
        year,
        month,
      }));
    };
  };

  const queryUserComparisonsByTime = function (options) {
    return function (dispatch, getState) {
      const { userKey, time } = options;
      const { startDate, endDate, granularity } = time;
      
      const endMonth = moment(endDate).month();
      const months = moment(endDate)
      .add(endMonth <= 6 ? 6 - endMonth : 12 - endMonth, 'month')
      .diff(moment(startDate), 'months', true);

      const iters = Math.ceil(months / 6);

      return Promise.all(Array.from({ length: iters }, (x, i) => {
        const currDate = moment(endDate).subtract(i * 6, 'month');
        const month = currDate.month() + 1 <= 6 ? 6 : 12;
        const year = currDate.year();
        return dispatch(queryUserComparisons({ userKey, month, year })); 
      }));
    };
  };

  const fetchUserComparison = function (options) {
    return function (dispatch, getState) {
      const { time, userKey, comparison } = options;
      const { startDate, endDate, granularity } = time;

      if (granularity !== 2 && granularity !== 4) {
        return Promise.reject('only day, month granularity supported in fetch comparisonByTime');
      }
      return dispatch(queryUserComparisonsByTime({ userKey, time }))
      .then(comparisonsArr => comparisonsArr.map((c) => {
        if (c === null) {
          return [];
        } else if (granularity === 2) {
          return c.dailyConsumtpion;
        } else if (granularity === 4) {
          return c.monthlyConsumtpion;
        }
        return [];
      }))
      .then(sessionsArr => sessionsArr.reduce((p, c) => [...p, ...c], []))
      .then(comparisons => comparisons.map(m => ({
        from: m.from,
        to: m.to,
        date: m.date,
        timestamp: granularity === 2 ? moment(m.date).valueOf() : moment(m.from).valueOf(),
        volume: m[comparison],
      })))
      .then(sessions => sessions.filter(s => granularity === 2 ? 
                    startDate <= moment(s.date).valueOf() && 
                      endDate >= moment(s.date).valueOf()
                    :
                    startDate <= moment(s.from).valueOf() &&
                      endDate >= moment(s.to).valueOf())
           );
    };
  };

  const fetchWaterIQ = function (options) {
    return function (dispatch, getState) {
      const { time, userKey } = options;
      const { startDate, endDate } = time;

      return dispatch(queryUserComparisonsByTime({ userKey, time }))
      .then(comparisonsArr => comparisonsArr.map(c => c == null ? [] : c.waterIq))
      .then(sessionsArr => sessionsArr.reduce((p, c) => [...p, ...c], []))
      .then(comparisons => comparisons.map(m => ({
        ...m,
        user: m.user.value,
        all: m.all.value,
        similar: m.similar.value,
        nearest: m.nearest.value,
        timestamp: moment(m.from).valueOf(),
        })))
      .then(sessions => sessions.filter(s => 
                    startDate <= moment(s.from).valueOf() && 
                      endDate >= moment(s.to).valueOf()));
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
  const fetchWidgetData = function (options) {
    return function (dispatch, getState) {
      const { type, userKey, deviceType, deviceKey = null, period, periodIndex, members, brackets, breakdown, common } = options;

      if (!type || !deviceType) {
        console.error('fetchWidgetData: Insufficient data provided (need type, deviceType):', options);
        throw new Error('fetchWidgetData: Insufficient data provided:');
      }
      
      // if no userKey just return 
      if (!userKey) {
        return Promise.resolve(); 
      }
      const time = options.time ? options.time : timeUtils.getTimeByPeriod(period, periodIndex);

      if (deviceType === 'METER') {      
        const prevTime = timeUtils.getPreviousPeriodSoFar(period, time.startDate);
        return dispatch(queryMeterHistory({ 
          userKey, 
          time, 
        }))
        .then(data => ({ data }))
        .then((res) => {
          if (type === 'total' && prevTime) {
            // fetch previous period data for comparison 
            return dispatch(queryMeterHistory({ 
              userKey, 
              time: prevTime, 
            }))
            .then(prevData => ({ ...res, previous: prevData, prevTime }))
            .catch((error) => { 
              console.error('Caught error in widget previous period data fetch:', error); 
            });
          } else if (type === 'forecast') {
            return dispatch(queryMeterForecast({ 
              userKey, 
              time, 
            }))
            .then(forecastData => ({ ...res, forecastData }));
          } else if (type === 'comparison') {
            return Promise.all(['similar', 'nearest', 'all', 'user']
                        .map(id => dispatch(fetchUserComparison({ 
                          comparison: id,
                          time, 
                          userKey, 
                        }))
                      .then(sessions => ({ id, sessions }))))
                  .then(comparisons => ({ ...res, comparisons }));
          } else if (type === 'wateriq') {
            return dispatch(fetchWaterIQ({ 
              userKey, 
              time: timeUtils.lastSixMonths(time.startDate), 
            }))
            .then(data => ({ ...res, data }));
          } else if (type === 'pricing') {
            return { ...res, brackets };
          } else if (type === 'breakdown') {
            return { ...res, breakdown };
          } else if (type === 'commons') {
            return dispatch(queryDataAverage({
              time,
              source: 'METER',
              population: [{ 
                type: 'GROUP',
                group: common.key,
              }],
            }))
            .then(populations => Array.isArray(populations) && populations.length > 0 ?
                 populations[0] : [])  
            .then(commonData => ({
              ...res,
              common,
              commonData,
            }));
          }
          return Promise.resolve(res);
        });
      } else if (deviceType === 'AMPHIRO') {
        if (type === 'last') {
          return dispatch(fetchLastDeviceSession({ 
            userKey, 
            deviceKey,
          }));
        } else if (type === 'ranking') {
          const activeMembers = genUtils.getAllMembers(members);
          return Promise.all(activeMembers.map(m => dispatch(queryDeviceSessions({
            length: genUtils.showerFilterToLength(period),
            memberFilter: m.index,
            userKey,
            deviceKey,
          })).then(memberData => ({ sessions: memberData, ...m }))))
          .then(data => ({ data }));
        }
        return dispatch(queryDeviceSessions({ 
          length: genUtils.showerFilterToLength(period),
          userKey,
          deviceKey,
        }))
        .then(data => ({ data }))
        .then(res => period !== 'all' ? 
              dispatch(queryDeviceSessions({
                length: genUtils.showerFilterToLength(period),
                deviceKey,
                userKey,
                index: -1,
              }))
              .then(prevData => ({ ...res, previous: prevData }))
              : Promise.resolve(res));
      }
      return Promise.reject(new Error('noDeviceType'));
    };
  };

  return {
    ...QueryBackend,
    requestedQuery,
    receivedQuery,
    resetSuccess,
    setError,
    dismissError,
    setInfo,
    dismissInfo,
    queryData,
    queryDataAverage,
    queryMeterForecast,
    queryDeviceSessions,
    fetchDeviceSession,
    fetchLastDeviceSession,
    queryMeterHistory,
    queryUserComparisons,
    fetchUserComparison,
    fetchWaterIQ,
    fetchWidgetData,
  };
};

module.exports = connectActionsToQueryBackend;
