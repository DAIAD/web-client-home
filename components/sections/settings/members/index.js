const React = require('react');
const bs = require('react-bootstrap');

const MainSection = require('../../../layout/MainSection');
const { SidebarLeft, SidebarRight } = require('../../../layout/Sidebars');
const Confirm = require('../../../helpers/ConfirmModal');

const { getActiveKey } = require('../../../../utils/general');
const { MAIN_MENU } = require('../../../../constants/HomeConstants');


function MembersSettings(props) {
  const { _t, confirm, children, routes, actions } = props;
  const { clickConfirmMember: clickConfirm, resetConfirm, goTo } = actions;

  const MEMBERS_MENU = MAIN_MENU
  .find(item => item.name === 'settings')
  .children
  .find(item => item.name === 'members')
  .children;

  const activeKey = getActiveKey(routes, 3);

  return (
    <MainSection id="section.members">
      <div className="section-row-container"> 
      <SidebarRight>
        <bs.Tabs
          position="left"
          tabWidth={50}
          activeKey={activeKey} 
          onSelect={(val) => { 
            goTo(MEMBERS_MENU.find(item => item.name === val).route);
          }}
        >
          {
            MEMBERS_MENU.map(m => (
              <bs.Tab 
                key={m.name} 
                eventKey={m.name} 
                title={_t(m.title)} 
              /> 
            ))
          }
        </bs.Tabs>
      </SidebarRight> 
      
      <div style={{ margin: 20, height: '100%', width: '100%' }}>
        {
          React.cloneElement(children, props)
        }
      </div>

      <Confirm
        show={confirm.item !== null && confirm.mode !== null}
        confirmation={confirm}
        message={confirm.item && confirm.mode ? `Are you sure you want to ${confirm.mode} member ${confirm.item.name}?` : ''}
        onConfirm={clickConfirm}
        onClose={resetConfirm}
      />
      </div>
    </MainSection>
  );
}

module.exports = MembersSettings;
