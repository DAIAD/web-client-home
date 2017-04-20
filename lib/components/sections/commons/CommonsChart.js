'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-echarts'),
    LineChart = _require.LineChart;

var _require2 = require('../../helpers/Navigators'),
    TimeNavigator = _require2.TimeNavigator,
    CustomTimeNavigator = _require2.CustomTimeNavigator;

var theme = require('../../chart/themes/history');

function CommonsChart(props) {
  var _t = props._t,
      isAfterToday = props.isAfterToday,
      handlePrevious = props.handlePrevious,
      handleNext = props.handleNext,
      time = props.time,
      timeFilter = props.timeFilter,
      chartData = props.chartData,
      chartCategories = props.chartCategories,
      actions = props.actions;
  var setDataQueryAndFetch = actions.setDataQueryAndFetch;

  var mu = 'lt';
  return React.createElement(
    'div',
    { className: 'history-chart-area' },
    timeFilter === 'custom' ? React.createElement(CustomTimeNavigator, {
      updateTime: function updateTime(newTime) {
        setDataQueryAndFetch({ time: newTime });
      },
      time: time
    }) : React.createElement(TimeNavigator, {
      handlePrevious: handlePrevious,
      handleNext: handleNext,
      hasNext: !isAfterToday,
      time: time
    }),
    React.createElement(LineChart, {
      width: '100%',
      height: 380,
      theme: theme,
      xAxis: {
        data: chartCategories,
        boundaryGap: true
      },
      yAxis: {
        formatter: function formatter(y) {
          return y + ' ' + mu;
        }
      },
      colors: theme.colors,
      series: chartData.map(function (s) {
        return _extends({}, s);
      })
    })
  );
}

module.exports = CommonsChart;