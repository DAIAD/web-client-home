const React = require('react');
const { Chart, LineChart, BarChart } = require('react-echarts');
const lineTheme = require('../chart/themes/default');
const horizontalBarTheme = require('../chart/themes/horizontal-bar');
const verticalBarTheme = require('../chart/themes/vertical-bar');


function LineChartWidget(props) {
  const { chartData, chartCategories, chartFormatter, mu, width, height } = props;
  return (
    <LineChart
      height={height || 240}
      width={width} 
      theme={lineTheme}
      title=""
      subtitle="" 
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        formatter: y => `${y} ${mu}`,
      }}
      series={chartData.map(s => ({
        fill: 0.55,
        ...s,
      }))}
    />
  );
}

function BarChartWidget(props) {
  const { chartData, chartCategories, chartFormatter, chartColors = [], mu, width, height } = props;
  return (
    <BarChart
      height={height || 240}
      width={width}
      theme={verticalBarTheme}
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        formatter: y => `${y} ${mu}`,
      }}
      series={chartData.map((s, idx) => ({ 
        ...s, 
        boundaryGap: true,
        color: chartColors.find((c, i, arr) => (idx % arr.length) === i),
        label: {
          position: 'top',
        } 
      }))}
    />
  );
}

function HorizontalBarChartWidget(props) {
  const { chartData, chartCategories, chartFormatter, chartColors = [], mu, width, height } = props;
  return (
    <BarChart
      height={height || 240}
      width={width}
      theme={horizontalBarTheme}
      horizontal
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        formatter: y => `${y} ${mu}`,
      }}
      series={chartData.map(s => ({ 
        ...s, 
        boundaryGap: true,
        color: (name, data, idx) => chartColors.find((c, i, arr) => (idx % arr.length) === i),
        label: { 
          position: 'right',
        } 
      }))}
    />
  );
}

function ChartWidget(props) {
  const { chartType, ...rest } = props;
  if (chartType === 'bar' || chartType === 'vertical-bar') {
    return (
      <BarChartWidget {...rest} />
    );
  } else if (chartType === 'horizontal-bar') {
    return (
      <HorizontalBarChartWidget {...rest} />
    );
  }
  return (
    <LineChartWidget {...rest} />
  );
}

module.exports = ChartWidget; 
