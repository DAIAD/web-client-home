const React = require('react');
const { IntlProvider, FormattedMessage } = require('react-intl');

const Header = require('../layout/Header');
const Footer = require('../layout/Footer');
const MainSidebar = require('../layout/MainSidebar');
const Loader = require('../helpers/Loader');
const QuerySuccess = require('../helpers/QuerySuccess');
const { debounce } = require('../../utils/general');

const { IMAGES, PNG_IMAGES, MAIN_MENU } = require('../../constants/HomeConstants');


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
      setLocale, errors, dismissError, children, routes, goTo } = this.props;
    if (!ready) {
      return <Loader imgPrefix={PNG_IMAGES} />;
    } 
    return (
      <IntlProvider 
        locale={locale.locale}
        messages={locale.messages} 
      >
        <div className="site-container">
          {
            loading ? <Loader imgPrefix={PNG_IMAGES} /> : <div /> 
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
            goTo={goTo}
          />

          <div className="main-container">
            {
              user.isAuthenticated ? 
                <MainSidebar menuItems={MAIN_MENU} routes={routes} imgPrefix={IMAGES} />
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
