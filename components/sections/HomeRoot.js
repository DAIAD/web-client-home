const React = require('react');
const { IntlProvider, FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const Header = require('../layout/Header');
const Footer = require('../layout/Footer');
const { debounce, getActiveLinks } = require('../../utils/general');

const { IMAGES, PNG_IMAGES, MAIN_MENU } = require('../../constants/HomeConstants');

function MainSidebar(props) {
  const { menuItems, routes = [] } = props;

  const activeLinks = getActiveLinks(routes);
  const activeKey = activeLinks.length > 1 ? activeLinks[1] : null;
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
                      <img src={`${IMAGES}/${item.image}`} alt={item.name} />
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

function Loader() {
  return (
    <div>
      <img 
        className="preloader" 
        src={`${PNG_IMAGES}/preloader-counterclock.png`} 
        alt="loading" 
      />
      <img 
        className="preloader-inner" 
        src={`${PNG_IMAGES}/preloader-clockwise.png`} 
        alt="loading" 
      />
    </div>
  );
}

function QuerySuccess() {
  return (
    <div className="query-success">
      <i 
        className="fa fa-check green " 
      />
    </div>
  );
}

const HomeRoot = React.createClass({
  componentWillMount: function () {
    this.props.init();
  },
  componentDidMount: function () {
    this.viewportListener = debounce(this.setViewport, 100, { maxWait: 1000 });
    window.addEventListener('resize', this.viewportListener);
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', this.viewportListener);
  },
  setViewport: function () {
    this.props.resize(
      document.documentElement.clientWidth, 
      document.documentElement.clientHeight
    );
  },
  render: function () {
    const { ready, locale, loading, user, deviceCount, messages, success,
      unreadNotifications, linkToNotification, totalNotifications, fetchMoreAll, logout, 
      setLocale, errors, dismissError, children, routes } = this.props;
    if (!ready) {
      return <Loader />;
    } 
    return (
      <IntlProvider 
        locale={locale.locale}
        messages={locale.messages} 
      >
        <div className="site-container">
          {
            loading ? <Loader /> : <div /> 
          }
          {
            success ? <QuerySuccess /> : <div />
          }
          <Header
            firstname={user.profile.firstname}
            photo={user.profile.photo}
            deviceCount={deviceCount}
            isAuthenticated={user.isAuthenticated}
            notifications={messages}
            totalNotifications={totalNotifications}
            unreadNotifications={unreadNotifications}
            loading={loading}
            linkToNotification={linkToNotification}
            fetchMoreAll={fetchMoreAll}
            locale={locale.locale}
            logout={logout} 
            setLocale={setLocale}
            errors={errors}
            dismissError={dismissError}
          />

          <div className="main-container">
            {
              user.isAuthenticated ? 
                <MainSidebar menuItems={MAIN_MENU} routes={routes} />
                :
                <MainSidebar menuItems={[]} />
            }
            {
                children
            }
          </div>
          <Footer />
        </div>
      </IntlProvider>
    );
  }
});

module.exports = HomeRoot;
