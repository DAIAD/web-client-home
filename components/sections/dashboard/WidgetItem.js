const React = require('react');

const { Widget } = require('../../helpers/Widgets');

const { IMAGES } = require('../../../constants/HomeConstants');

function WidgetErrorDisplay(props) {
  return props.errors ? 
    <div style={{ zIndex: 100 }}>
      <img src={`${IMAGES}/alert.svg`} alt="error" />
      <span className="widget-error">{`${props.errors}`}</span>
    </div>
    :
    <div />;
}


const WidgetItem = React.createClass({
  getInitialState: function () {
    return {
      el: null 
    };
  },
  render: function () {
    const { widget, updateWidgetAndFetch, removeWidget, _t, linkToHistory, width } = this.props;
    const { id, icon, error, period, title, type, display, periods, time, timeDisplay } = widget;
    return (
      <div 
        className="widget"
        ref={(el) => { if (!this.state.el) { this.setState({ el }); } }}
      >
        <div className="widget-header">
          <div className="header-left">
            <h4>
              { icon ? 
                <img 
                  style={{ marginRight: 10, maxHeight: 25 }} 
                  src={`${IMAGES}/${icon}`} 
                  alt="icon" 
                />
                :
                  <i />
              }
              {title}
            </h4>
          </div>

          <div className="header-right">
            <div>
              { timeDisplay }
              {
                periods && periods.map(p => (
                  <button
                    className={`btn-a widget-period ${p.id === period ? 'active' : ''}`}
                    key={p.id} 
                    onClick={() => updateWidgetAndFetch(id, { period: p.id })} 
                  >
                    { _t(p.title) }
                  </button>
                  ))
              }
            </div> 
            {
              <button
                className="btn-a widget-x" 
                style={{ float: 'right', marginLeft: 5, marginRight: 5 }} 
                onClick={() => removeWidget(widget.id)}
              >
                <i className="fa fa-times" />
              </button>
            }
          </div>
        </div>
        
        <div className="widget-body">
          {
            error ? 
              <WidgetErrorDisplay errors={error} />
              :
              <Widget 
                {...widget} 
                imgPrefix={IMAGES}
                width={this.state.el ? this.state.el.clientWidth : '100%'}
                height={this.state.el ? this.state.el.clientHeight - 90 : null}
              />    
          }
        </div>
        <div className="widget-footer">
          <button 
            className="btn-a"
            onClick={() => linkToHistory(widget)}
          >
            {widget.more || _t('widget.explore')}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = WidgetItem;
