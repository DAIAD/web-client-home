const React = require('react');
const classNames = require('classnames');
const bs = require('react-bootstrap');
const { Link } = require('react-router');
const { injectIntl, FormattedMessage } = require('react-intl');

const LocaleSwitcher = require('../LocaleSwitcher');
const Logout = require('../LogoutForm');
const NotificationList = require('../helpers/NotificationList');
const { formatMessage } = require('../../utils/general');
const { IMAGES, PNG_IMAGES, BASE64 } = require('../../constants/HomeConstants'); 

/* DAIAD Logo */
function MainLogo() {
  return (
    <Link to="/" className="logo" activeClassName="selected">
      <img 
        src={`${IMAGES}/daiad-logo-navy.svg`} 
        alt="DAIAD"
        title="DAIAD"
      />
    </Link>
  );
}

/* User options */

function UserInfo(props) {
  const { _t } = props;
  return (
    <div className="user-menu" >
      <div title={_t('section.profile')}>
        <Link to="settings/profile">
          <span><b>{props.firstname}</b></span>
          { 
            props.photo ? 
              <img 
                className="profile-header-photo"
                src={`${BASE64}${props.photo}`} 
                alt="profile" 
              />
              :
              <img
                className="profile-header-photo"
                src={`${PNG_IMAGES}/daiad-consumer.png`} 
                alt="profile"
              />
           }
        </Link>
      </div>
    </div>
  );
}

const NotificationMenuItem = React.createClass({
  getInitialState: function () {
    return {
      hover: false,
      popover: false
    };
  },
  render: function () {
    const hasUnread = this.props.unreadNotifications > 0 ? 'hasUnread' : '';
    const unreadNotifications = hasUnread ? this.props.unreadNotifications : '';
    const { _t } = this.props;
    return (
      
      <bs.OverlayTrigger 
        id="notifications-trigger"
        trigger="click"
        title={_t(this.props.item.title)}
        placement="bottom"
        onEnter={() => this.setState({ popover: true })}
        onExit={() => this.setState({ popover: false })}
        rootClose
        ref={(node) => { this.node = node; }}
        overlay={
          <bs.Popover 
            id="notifications-popover"
            title={_t(this.props.item.title)} 
          >
            <NotificationList
              notifications={this.props.notifications} 
              onItemClick={(id, type) => {
                this.node.hide();
                this.props.linkToNotification(id, type); 
              }}
              hasMore={!this.props.loading && (this.props.notifications.length < this.props.totalNotifications)}
              loadMore={this.props.fetchMoreAll}
            />
            <div className="footer">
              <a 
                className="notifications-show-all"
                onClick={() => {
                  this.node.hide();
                  this.props.goTo('notifications');
                }}
              >
                {_t('notifications.showAll')}
              </a>
            </div>
          </bs.Popover>
        }
      >
        <a
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })} 
        >
          <span className={classNames(hasUnread, 'red')}>{unreadNotifications}</span> 
          <i 
            className={classNames('fa', 'fa-md', 'navy', 
                                  (this.state.hover || this.state.popover) ? 
                                    'fa-bell' : 'fa-bell-o'
                                 )} 
          />
        </a>
      </bs.OverlayTrigger>  
    );
  }
});

function NotificationArea(props) {
  return (
    <div className="notification-area">
      <div className="notifications notification-item">
        <NotificationMenuItem
          {...{
            ...props,
            item: {
              name: 'notifications',
              title: 'section.notifications',
              image: 'images/svg/info.svg',
              link: '#',
            }
          }}
        />
      </div>
    </div>  
  );
}

function ErrorDisplay(props) {
  const { _t, errors, dismissError } = props;
  return errors ? 
    <div className="error-display">
      <a onClick={() => dismissError()} className="error-display-x">x</a>
      <img src={`${IMAGES}/alert.svg`} alt="error" />
      <span className="widget-error">
        <FormattedMessage id={`errors.${errors}`} />
      </span>
    </div>
    :
    <div />;
}

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
            />
            <MainLogo />
            <div className="top-header-right">
              <NotificationArea
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
              <UserInfo
                _t={_t}
                photo={photo}
                firstname={firstname}
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
            <MainLogo />
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

