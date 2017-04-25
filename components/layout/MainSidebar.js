const React = require('react');
const { FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const { getActiveKey } = require('../../utils/general');

function MainSidebar(props) {
  const { menuItems, imgPrefix, routes = [] } = props;
  const activeKey = getActiveKey(routes, 1);

  return (
    <aside className="main-sidebar">
      <ul className="main-menu-side">
        {
          menuItems.map(item => item.hidden ? <div key={item.name} /> : 
              <li 
                key={item.name} 
                className={item.name === activeKey ? 
                  'menu-item active' 
                    : 'menu-item'} 
              >
              <Link to={item.route}>
                {
                  item.image ? 
                    <div style={{ float: 'left', minWidth: 25 }}>
                      <img 
                        style={{ width: 20, maxHeight: 20 }} 
                        src={
                          item.name === activeKey && item.activeImage ? 
                            `${imgPrefix}/${item.activeImage}`
                            :
                              `${imgPrefix}/${item.image}`
                        } 
                        alt={item.name} 
                      />
                    </div>
                    : 
                    null
                }
                <FormattedMessage id={item.title} />
              </Link>
            </li>
            )
        }
      </ul>
    </aside>
  );
}

module.exports = MainSidebar;
