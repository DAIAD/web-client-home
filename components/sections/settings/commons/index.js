const React = require('react');
const bs = require('react-bootstrap');

const MainSection = require('../../../layout/MainSection');
const { SidebarLeft, SidebarRight } = require('../../../layout/Sidebars');

const { getActiveLinks } = require('../../../../utils/general');
const { MAIN_MENU } = require('../../../../constants/HomeConstants');

function Confirm(props) {
  const { show, close, action, confirmation } = props;
  if (!confirmation) {
    return <div />;
  }
  const [mode, common] = confirmation;
  return (
    <bs.Modal 
      animation={false} 
      show={show}
      onHide={close} 
      dialogClassName="confirmation-modal"
      bsSize="sm"
    >
      <bs.Modal.Header closeButton>
        <bs.Modal.Title>
         Confirmation 
        </bs.Modal.Title>
      </bs.Modal.Header>
      <bs.Modal.Body>
        <span>{`Are you sure you want to ${mode} ${common.name}?`}</span>
      </bs.Modal.Body>
      <bs.Modal.Footer>
        <a style={{ marginRight: 20 }} onClick={close}>Cancel</a>
        <a onClick={action}>Confirm</a>
      </bs.Modal.Footer>
    </bs.Modal> 
  );
}

function CommonsSettings(props) {
  const { intl, searchFilter, confirm, active, mode, myCommons, allCommons, actions, params, children, commonForm, routes, searchCommons } = props;
  const { setSearchFilter, setConfirm, clickConfirm, resetConfirm, goTo } = actions;

  const COMMONS_MENU = MAIN_MENU
  .find(item => item.name === 'settings')
  .children
  .find(item => item.name === 'commons')
  .children;

  const activeLinks = getActiveLinks(routes);
  const activeKey = activeLinks.length > 3 ? activeLinks[3] : null;

  const _t = x => intl.formatMessage({ id: x });
  return (
    <MainSection id="section.commons">
      <div className="section-row-container"> 
      <SidebarRight>
        <bs.Tabs
          position="left"
          tabWidth={50}
          activeKey={activeKey} 
          onSelect={(val) => { 
            goTo(`/settings/commons/${val}`); 
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
        show={confirm !== null}
        confirmation={confirm}
        action={clickConfirm}
        close={resetConfirm}
      />
      </div>
    </MainSection>
  );
}

module.exports = CommonsSettings;
