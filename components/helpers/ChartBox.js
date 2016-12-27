const React = require('react');
const Chart = require('./Chart');

function ChartBox(props) {
  const { type, chartData, chartCategories, chartFormatter, chartColors, 
    chartXAxis, mu, invertAxis } = props;

  if (!(chartData && chartData.length > 0)) {
    return <div />;
  }

  if (type === 'budget') {
    return (
      <div> 
        <div style={{ float: 'left', width: '50%' }} >
          <Chart
            height={70}
            width="100%"
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
      <Chart
        height={200}
        width="100%"  
        title=""
        type="bar"
        subtitle=""
        xMargin={0}
        y2Margin={0}  
        yMargin={0}
        x2Margin={0}
        fontSize={12}
        mu={mu}
        invertAxis={invertAxis}
        xAxis={chartXAxis}
        xAxisData={chartCategories}
        colors={chartColors}
        data={chartData}
      />
    );
  } else if (type === 'total' || type === 'last') {
    return (
      <Chart
        height={200}
        width="100%"  
        title=""
        subtitle=""
        type="line"
        yMargin={10}
        y2Margin={40}
        fontSize={12}
        mu={mu}
        formatter={chartFormatter}
        invertAxis={invertAxis}
        xAxis={chartXAxis}
        xAxisData={chartCategories}
        colors={chartColors}
        data={chartData}
      />
    );
  }
  return <span>Oops, no data available...</span>;
}
 
module.exports = ChartBox;
