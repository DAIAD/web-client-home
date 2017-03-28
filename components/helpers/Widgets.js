const React = require('react');
const { Chart, LineChart, BarChart } = require('react-echarts');
const lineTheme = require('../chart/themes/default');
const horizontalBarTheme = require('../chart/themes/horizontal-bar');
const verticalBarTheme = require('../chart/themes/vertical-bar');

const { IMAGES } = require('../../constants/HomeConstants');

function defaultFormatter(mu) {
  return function (y) {
    return `${y} ${mu}`;
  };
}

function StatWidget(props) {
  const { highlight, info = [], period, mu } = props;
  const highlightWidth = highlight.width || 30;
  return (
    <div style={{ padding: 10, marginLeft: 10 }}>
      <div style={{ float: 'left', width: highlight != null ? `${highlightWidth}%` : '0%' }}>
        { 
          (() => {
             if (highlight && highlight.image != null && highlight.text != null) {
              // image and text
              return (
                <div style={{ textAlign: 'center' }}>
                  <img style={{ height: 40, width: 40, float: 'left' }} src={`${IMAGES}/${highlight.image}`} alt={highlight.image} /> 
                  <h2>
                    <span>{highlight.text}</span>
                    <span style={{ fontSize: '0.5em', marginLeft: 5 }}>{highlight.mu}</span>
                  </h2>
                </div>
                );
            } else if (highlight && highlight.text == null && highlight.image != null) {
              //only image
              return (
                <img style={{ height: 55 }} src={`${IMAGES}/${highlight.image}`} alt={highlight.image} /> 
              );
            } else if (highlight && highlight.image == null && highlight.text != null) {
              //only text
              return (
                <h2>
                  <span>{highlight.text}</span>
                  <span style={{ fontSize: '0.5em', marginLeft: 5 }}>{highlight.mu}</span>
                </h2>
                );
            } 
            //nothing
            return (
              <div />
              );
          })()
        }
      </div>
      <div style={{ float: 'left', width: highlight != null ? `${100 - highlightWidth}%` : '100%' }}>
        <div>
          { 
            info.map((line, idx) => (
              <div key={idx} style={{ float: 'left', margin: '0 10px 5px 0' }}>
                <i className={`fa fa-${line.icon}`} />
                { line.image ? <img style={{ maxHeight: 30, maxWidth: 30 }} src={`${IMAGES}/${line.image}`} alt={line.id} /> : <i /> }
                &nbsp;
                <span>{line.text}</span>
              </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

function LineChartWidget(props) {
  const { chartData = [], chartCategories, chartFormatter, mu, width, height } = props;
  const formatter = chartFormatter || defaultFormatter(mu);
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
        min: 0,
        formatter,
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
  const formatter = chartFormatter || defaultFormatter(mu);
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
        min: 0,
        formatter,
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
  const formatter = chartFormatter || defaultFormatter(mu);
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
        min: 0,
        formatter,
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
  return (
    <div>
      { 
        (() => {
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
        })()
      }
    </div>
  );
}

function HybridWidget(props) {
  return (
    <div> 
      <ChartWidget {...props} />
      <StatWidget {...props} /> 
    </div>
  );
}

module.exports = {
  StatWidget,
  ChartWidget,
  HybridWidget,
};
