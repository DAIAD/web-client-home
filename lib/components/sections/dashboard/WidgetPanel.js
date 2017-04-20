'use strict';

var React = require('react');

var _require = require('react-grid-layout'),
    Responsive = _require.Responsive,
    WidthProvider = _require.WidthProvider;

var WidgetItem = require('./WidgetItem');

var ResponsiveGridLayout = WidthProvider(Responsive);

function WidgetPanel(props) {
  var _t = props._t,
      mode = props.mode,
      layout = props.layout,
      widgets = props.widgets,
      updateLayout = props.updateLayout,
      updateWidgetAndFetch = props.updateWidgetAndFetch,
      removeWidget = props.removeWidget,
      periods = props.periods,
      linkToSection = props.linkToSection,
      width = props.width;

  return React.createElement(
    ResponsiveGridLayout,
    {
      className: 'layout',
      layouts: { lg: layout, md: layout, sm: layout },
      breakpoints: { lg: 1200, md: 800, sm: 200 },
      cols: { lg: 6, md: 4, sm: 2 },
      rowHeight: 165,
      measureBeforeMount: true,
      draggableHandle: '.widget-header',
      resizable: true,
      draggable: true,
      onResizeStop: function onResizeStop(newLayout) {
        updateLayout(newLayout);
      },
      onDragStop: function onDragStop(newLayout) {
        updateLayout(newLayout);
      }
    },
    widgets.map(function (widget) {
      return React.createElement(
        'div',
        { key: widget.id },
        React.createElement(WidgetItem, {
          mode: mode,
          periods: periods,
          widget: widget,
          updateWidgetAndFetch: updateWidgetAndFetch,
          removeWidget: removeWidget,
          _t: _t,
          linkToSection: linkToSection,
          width: width
        })
      );
    })
  );
}

module.exports = WidgetPanel;