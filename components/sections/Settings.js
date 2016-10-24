var React = require('react');


var Settings = React.createClass({
  render: function() {
    return (
      <div>
        {
          this.props.children
        }
      </div>
    );
  }
});

module.exports = Settings;
