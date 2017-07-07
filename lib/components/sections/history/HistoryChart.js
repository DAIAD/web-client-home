'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');

var _require = require('react-echarts'),
    Chart = _require.Chart,
    LineChart = _require.LineChart,
    BarChart = _require.BarChart;

var theme = require('../../chart/themes/history');

function HistoryChart(props) {
  var chartType = props.chartType,
      chartData = props.chartData,
      chartCategories = props.chartCategories,
      chartFormatter = props.chartFormatter,
      chartYMax = props.chartYMax,
      onPointClick = props.onPointClick,
      width = props.width;

  return React.createElement(
    'div',
    { className: 'history-chart' },
    React.createElement(Chart, {
      width: width,
      height: 380,
      theme: theme,
      xAxis: {
        data: chartCategories,
        boundaryGap: true
      },
      yAxis: {
        formatter: chartFormatter,
        min: 0,
        max: chartYMax
      },
      onPointClick: onPointClick,
      series: chartData.map(function (s, i) {
        return _extends({
          fill: 0.55,
          type: chartType,
          symbol: theme.symbol[i % theme.symbol.length]
        }, s);
      })
    })
  );
}

module.exports = HistoryChart;