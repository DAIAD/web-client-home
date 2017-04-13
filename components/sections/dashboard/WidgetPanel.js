const React = require('react');
const { Responsive, WidthProvider } = require('react-grid-layout');

const WidgetItem = require('./WidgetItem'); 

const ResponsiveGridLayout = WidthProvider(Responsive);

function WidgetPanel(props) {
  const { _t, mode, layout, widgets, updateLayout, updateWidgetAndFetch, removeWidget, 
    periods, linkToSection, width } = props;
  return (
    <ResponsiveGridLayout 
      className="layout"
      layouts={{ lg: layout, md: layout, sm: layout }}
      breakpoints={{ lg: 1080, md: 650, sm: 200 }}
      cols={{ lg: 4, md: 4, sm: 2 }}
      rowHeight={160}
      measureBeforeMount
      draggableHandle=".widget-header"
      resizable
      draggable
      onResizeStop={(newLayout) => { 
        updateLayout(newLayout);  
      }}
      onDragStop={(newLayout) => {
        updateLayout(newLayout); 
      }} 
      onLayoutChange={(newLayout) => {
      }}
      onBreakpointChange={(newBreakpoint) => {
      }}
    >
      {
       widgets.map(widget => (
         <div key={widget.id}>
           <WidgetItem 
             {...{
               mode, 
               periods, 
               widget, 
               updateWidgetAndFetch, 
               removeWidget, 
               _t,
               linkToSection,
               width,
             }} 
           /> 
         </div>
         ))
      }
    </ResponsiveGridLayout>
  );
}

module.exports = WidgetPanel;
