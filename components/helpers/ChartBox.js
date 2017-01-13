const React = require('react');
const Chart = require('./Chart');
const { LineChart, BarChart } = require('react-echarts');
const lineTheme = require('../chart/themes/default');
const horizontalBarTheme = require('../chart/themes/horizontal-bar');
const verticalBarTheme = require('../chart/themes/vertical-bar');

function ChartBox(props) {
  const { type, chartData, chartCategories, chartFormatter, chartColors, 
    chartXAxis, mu, invertAxis, width, height } = props;

  if (!(chartData && chartData.length > 0)) {
    return <div />;
  }

  if (type === 'budget') {
    return (
      <div> 
        <div style={{ float: 'left', width: '50%' }} >
          <Chart
            height={height || 70}
            width={width}
            type="pie"
            title={chartData[0].title}
            subtitle=""
            fontSize={16}
            mu=""
            colors={chartColors}
            data={chartData}
          /> 
        </div>
        <div style={{ width: '50%', float: 'right', textAlign: 'center' }}>
          <b>{chartData[0].data[0].value} lt</b> consumed<br />
          <b>{chartData[0].data[1].value} lt</b> remaining
        </div>
      </div>
    );
  } else if (type === 'breakdown' || type === 'forecast' || type === 'comparison') {
    return (
      <BarChart
        height={height || 240}
        width={width}
        theme={invertAxis ? horizontalBarTheme : verticalBarTheme}
        horizontal={invertAxis}
        xAxis={{
          data: chartCategories,
          boundaryGap: true,
        }}
        yAxis={{
          formatter: y => `${y} ${mu}`,
        }}
        series={chartData.map(s => ({ 
          ...s, 
          color: (name, data, idx) => chartColors.find((c, i, arr) => (idx % arr.length) === i),
          label: { 
            position: invertAxis ? 'right' : 'top',
          } 
        }))}
      />
    );
  } else if (type === 'total' || type === 'last') {
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
        colors={chartColors}
        series={chartData.map(s => ({
          ...s,
          fill: 0.55,
        }))}
      />
    );
  }
  return <span>Oops, no data available...</span>;
}
 
module.exports = ChartBox;
