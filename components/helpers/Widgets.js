const React = require('react');
const { Chart, LineChart, BarChart } = require('react-echarts');
const DisplayMetric = require('./DisplayMetric');

const lineTheme = require('../chart/themes/default');
const horizontalBarTheme = require('../chart/themes/horizontal-bar');
const verticalBarTheme = require('../chart/themes/vertical-bar');

function StatWidget(props) {
  const { highlight, info = [], period, mu, imgPrefix } = props;
  return (
    <div className={`stat ${props.type}`}>
      <div className="stat-left">
        <div>
          { highlight && highlight.image ? 
            <img 
              className="stat-highlight" 
              style={{ height: props.height }}
              src={highlight.image}
              alt={highlight.image} 
            /> 
            :
            <i />
          }
          <h2>
            <DisplayMetric value={highlight.text} />
          </h2>
        </div>
      </div>
      <div className="stat-right">
        <div>
          { 
            info.map((line, idx) => (
              <div 
                key={idx} 
                className="stat-line"
              >
                <i className={`fa fa-${line.icon}`} />
                { 
                  line.image ? 
                    <img 
                      className="stat-line-img"
                      src={line.image} 
                      alt={line.id} 
                    /> 
                      : <i /> 
                }
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
  const { id, chartData = [], chartCategories, chartFormatter, chartColorFormatter, mu, width, height, legend, renderAsImage = false } = props;
  return (
    <LineChart
      height={height || 240}
      width={width} 
      id={id}
      renderAsImage={renderAsImage}
      theme={lineTheme}
      legend={legend}
      title=""
      subtitle="" 
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        min: 0,
        formatter: chartFormatter,
      }}
      series={chartData.map(s => ({
        fill: 0.55,
        color: chartColorFormatter,
        ...s,
      }))}
    />
  );
}

function BarChartWidget(props) {
  const { id, chartData, chartCategories, chartFormatter, chartColorFormatter, mu, width, height, legend, renderAsImage = false } = props;
  return (
    <BarChart
      height={height || 240}
      width={width}
      id={id}
      renderAsImage={renderAsImage}
      theme={verticalBarTheme}
      legend={legend}
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        min: 0,
        formatter: chartFormatter,
      }}
      series={chartData.map((s, idx) => ({ 
        ...s, 
        boundaryGap: true,
        color: chartColorFormatter,
        label: {
          position: 'top',
        } 
      }))}
    />
  );
}

function HorizontalBarChartWidget(props) {
  const { id, chartData, chartCategories, chartFormatter, chartColorFormatter, mu, width, height, legend, renderAsImage = false } = props;
  return (
    <BarChart
      height={height || 220}
      width={width}
      id={id}
      renderAsImage={renderAsImage}
      theme={horizontalBarTheme}
      legend={legend}
      horizontal
      xAxis={{
        data: chartCategories,
        boundaryGap: true,
      }}
      yAxis={{
        min: 0,
        formatter: chartFormatter,
      }}
      series={chartData.map(s => ({ 
        ...s, 
        boundaryGap: true,
        color: chartColorFormatter,
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
    <div className="chart">
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

function DefaultWidgetByDisplay(props) {
  const { display } = props;
  if (display === 'stat') {
    return (
      <StatWidget {...props} /> 
    );
  } else if (display === 'chart') {
    return (
      <ChartWidget
        {...props} 
      /> 
    );
  } 
  return <div />;
}

function RankingWidget(props) {
  return (
    <div className="ranking">
      <ChartWidget 
        {...props} 
        height={props.height ? props.height - 40 : 200}
      />
      <div style={{ padding: '0 10px' }}>
      {
        props.info.map((line, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'inline-block', 
              width: `${100 / props.info.length}%`, 
              textAlign: 'center' 
            }}
          >
          { 
            line.image ? 
              <img
                className="ranking-medal"
                src={line.image}
                alt={line.id} 
              /> 
                : <i /> 
          }
            &nbsp;
            <span>{line.text}</span>
          </div>
          ))
      }
    </div>
    </div>
  );
}
function LastShowerWidget(props) {
  return (
    <div className="last">
      <ChartWidget
        {...props}
        height={props.height - 50}
      />
      <div style={{ padding: '0 10px' }}>
        <div style={{ float: 'left', textAlign: 'center' }}>
          <img style={{ height: 40, width: 40, float: 'left' }} src={props.highlight.image} alt={props.highlight.image} /> 
          <h3 style={{ float: 'left' }}>
            <DisplayMetric value={props.highlight.text} /> 
          </h3>
        </div>
        {
        props.info.map((line, idx) => (
          <div 
            key={idx} 
            style={{
              float: 'left', 
              marginTop: 10,
              width: Math.max((props.width - 150) / props.info.length, 50),
              textAlign: 'center',
            }}
          >
          { 
            line.image ? 
              <img
                style={{ maxHeight: 30, maxWidth: 30 }} 
                src={line.image} 
                alt={line.id} 
              /> 
                : <i /> 
          }
            &nbsp;
            <span>{line.text}</span>
          </div>
          ))
      }
    </div>
  </div>
  );
}

function TipWidget(props) {
  const { highlight, info = [], period, mu, imgPrefix } = props;
  return (
    <div className="tip">
      <div className="tip-left">
          { highlight && highlight.image ? 
            <img 
              src={highlight.image}
              alt={highlight.image} 
            /> 
            :
            <i />
          }
        </div>
      <div className="tip-right">
        <div>
          { 
            info.map((line, idx) => (
              <div key={idx}>
                <span>{line.text}</span>
              </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}


function Widget(props) {
  const { type } = props;
  switch (type) {
    case 'ranking':
      return <RankingWidget {...props} />;
    case 'last':
      return <LastShowerWidget {...props} />;
    case 'tip':
      return <TipWidget {...props} />;
    default:
      return <DefaultWidgetByDisplay {...props} />;
  }
}

module.exports = {
  StatWidget,
  ChartWidget,
  Widget,
};
