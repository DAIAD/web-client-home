const React = require('react');
const bs = require('react-bootstrap');

const MainSection = require('../../../layout/MainSection');
const { SidebarLeft, SidebarRight } = require('../../../layout/Sidebars');
const Confirm = require('../../../helpers/ConfirmModal');

const { getActiveKey } = require('../../../../utils/general');
const { MAIN_MENU } = require('../../../../constants/HomeConstants');


function CommonsSettings(props) {
  const { _t, searchFilter, confirm, active, mode, myCommons, allCommons, actions, params, children, commonForm, routes, searchCommons } = props;
  const { setSearchFilter, setConfirm, clickConfirmCommon: clickConfirm, resetConfirm, goTo } = actions;

  const COMMONS_MENU = MAIN_MENU
  .find(item => item.name === 'settings')
  .children
  .find(item => item.name === 'commons')
  .children;

  const activeKey = getActiveKey(routes, 3);

  return (
    <MainSection id="section.commons">
      <div className="section-row-container"> 
      <SidebarRight>
        <bs.Tabs
          position="left"
          tabWidth={50}
          activeKey={activeKey} 
          onSelect={(val) => { 
            goTo(COMMONS_MENU.find(item => item.name === val).route);
          }}
        >
          {
            COMMONS_MENU.map(m => (
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
        show={confirm.mode !== null && confirm.item !== null}
        confirmation={confirm}
        message={confirm.item && confirm.mode ? 
          _t('forms.confirm', { 
            action: String(_t(`forms.${confirm.mode}`)).toLowerCase(), 
            item: confirm.item.name,
          })
          : ''}
        onConfirm={clickConfirm}
        onClose={resetConfirm}
      />
      </div>
    </MainSection>
  );
}

module.exports = CommonsSettings;
