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
      breakpoints={{ lg: 1200, md: 800, sm: 200 }}
      cols={{ lg: 6, md: 4, sm: 2 }}
      rowHeight={170}
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
