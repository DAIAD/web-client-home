const React = require('react');
const ReactDOM = require('react-dom');
const { LineChart, BarChart } = require('react-echarts');
const theme = require('../chart/themes/history');

function HistoryChart(props) {
  const { chartData, xCategoryLabels, mu, onPointClick, width } = props;
  
  return (
    <LineChart 
      width={width}
      height={380}
      theme={theme}
      xAxis={{
        data: xCategoryLabels,
        boundaryGap: true,
      }}
      yAxis={{
        formatter: y => `${y} ${mu}`,
        min: 0,
      }}
      onPointClick={onPointClick}
      series={chartData.map((s, i) => ({
        fill: 0.55,
        symbol: theme.symbol[i % theme.symbol.length],
        ...s,
      }))}
    />
  );
}

module.exports = HistoryChart;
