const React = require('react');
const ReactDOM = require('react-dom');
const { Chart, LineChart, BarChart } = require('react-echarts');
const theme = require('../chart/themes/history');

function HistoryChart(props) {
  const { chartType, chartData, chartCategories, chartFormatter, chartYMax, onPointClick, width } = props;
  return (
    <Chart 
      width={width}
      height={380}
      theme={theme}
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        formatter: chartFormatter,
        min: 0,
        max: chartYMax,
      }}
      onPointClick={onPointClick}
      series={chartData.map((s, i) => ({
        fill: 0.55,
        type: chartType,
        symbol: theme.symbol[i % theme.symbol.length],
        ...s,
      }))}
    />
  );
}

module.exports = HistoryChart;
