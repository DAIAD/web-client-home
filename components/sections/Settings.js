const React = require('react');

const MainSection = require('../layout/MainSection');

const Settings = function (props) {
  return (
    <MainSection id="section.settings"> 
      {
        React.cloneElement(props.children, { ...props })
      }
    </MainSection>
  );
};

module.exports = Settings;
