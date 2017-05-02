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
    const { widget, updateWidgetAndFetch, removeWidget, _t, linkToSection, width } = this.props;
    const { id, widgetId, icon, error, period, type, display, periods, time, timeDisplay, linkTo = 'history' } = widget;
    return (
      <div 
        className="widget"
        ref={(el) => { if (!this.state.el) { this.setState({ el }); } }}
      >
        <div className="widget-header">
          <div className="header-left">
            <h5>
              { icon ? 
                <img 
                  className="widget-header-icon"
                  src={icon} 
                  alt="icon" 
                />
                :
                  <i />
              }
              { widget.title || _t(`widget.titles.${widgetId}`) }
            </h5>
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
              <button
                className="btn-a widget-x" 
                onClick={() => removeWidget(widget.id)}
              >
                <i className="fa fa-times" />
              </button>
            </div> 
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
            onClick={() => linkToSection(linkTo, widget)}
          >
            {widget.more || _t('widget.explore')}
          </button>
        </div>
      </div>
    );
  }
});

module.exports = WidgetItem;
