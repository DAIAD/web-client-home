const React = require('react');
const bs = require('react-bootstrap');
const { Link } = require('react-router');

const MainSection = require('../../layout/MainSection');
const Topbar = require('../../layout/Topbar');
const { getActiveLinks } = require('../../../utils/general');
const { MAIN_MENU } = require('../../../constants/HomeConstants');

const Settings = function (props) {
  const { intl, children, location, route, routes, actions } = props;
  const { goTo } = actions;

  const SETTINGS_MENU = MAIN_MENU.find(item => item.name === 'settings').children;

  const activeLinks = getActiveLinks(routes);
  const activeKey = activeLinks.length > 2 ? activeLinks[2] : null;

  const _t = x => intl.formatMessage({ id: x });
  return (
    <MainSection id="section.settings">   
      <Topbar> 
        <bs.Tabs 
          position="top" 
          tabWidth={3}
          activeKey={activeKey}
          onSelect={val => goTo(`/settings/${val}`)}
        >
          {
            SETTINGS_MENU.map(item => item.hidden ? <div key={item.name} /> : (
              <bs.Tab 
                key={item.name}
                eventKey={item.name} 
                title={_t(item.title)} 
              />
            ))
          } 
        </bs.Tabs>
      </Topbar>
      {
        React.Children.map(children, child =>
          React.cloneElement(child, { ...props, ...child.props })
                          )
      }
    </MainSection>
  );
};

module.exports = Settings;
