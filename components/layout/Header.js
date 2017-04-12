const React = require('react');
const { Link } = require('react-router');
const { injectIntl, FormattedMessage } = require('react-intl');

const LocaleSwitcher = require('../helpers/LocaleSwitcher');
const Logout = require('../helpers/LogoutForm');
const ErrorDisplay = require('../helpers/ErrorDisplay');
const NotificationsMenuItem = require('../helpers/NotificationsMenuItem');
const UserMenuItem = require('../helpers/UserMenuItem');
const MainLogo = require('../helpers/MainLogo');

const { formatMessage } = require('../../utils/general');

const { IMAGES, PNG_IMAGES, BASE64 } = require('../../constants/HomeConstants'); 


function Header(props) {   
  const { intl, firstname, photo, isAuthenticated, notifications, linkToNotification, 
    unreadNotifications, totalNotifications, logout, deviceCount, setLocale, locale, 
    errors, dismissError, fetchMoreAll, loading, goTo } = props;

  const _t = formatMessage(intl);
  return (
    <header className="site-header">
      {
        isAuthenticated ? 
          <div>
            <ErrorDisplay
              _t={_t}
              dismissError={dismissError}
              errors={errors} 
              imgPrefix={IMAGES}
            />
            <MainLogo imgPrefix={IMAGES} />
            <div className="top-header-right">
              <NotificationsMenuItem
                _t={_t}
                deviceCount={deviceCount}
                notifications={notifications} 
                unreadNotifications={unreadNotifications}
                totalNotifications={totalNotifications}
                loading={loading}
                fetchMoreAll={fetchMoreAll}
                linkToNotification={linkToNotification}
                goTo={goTo}
              />
              <UserMenuItem
                _t={_t}
                photo={photo}
                firstname={firstname}
                imgPrefix={PNG_IMAGES}
                base64Prefix={BASE64}
              />
              <Logout
                _t={_t}
                isAuthenticated={isAuthenticated}
                logout={logout}
                className="navbar logout"
              />
            </div>
          </div>
          : 
          <div>
            <MainLogo imgPrefix={IMAGES} />
            <div className="top-header-right">
              <LocaleSwitcher
                _t={_t}
                setLocale={setLocale}
                locale={locale}
              /> 
            </div>
          </div>
     }
    </header>
  );
}

module.exports = injectIntl(Header);

