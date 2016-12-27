const React = require('react');
const classNames = require('classnames');
const bs = require('react-bootstrap');
const { Link } = require('react-router');
const { injectIntl, FormattedMessage } = require('react-intl');

const LocaleSwitcher = require('../LocaleSwitcher');
const Logout = require('../LogoutForm');

const { IMAGES } = require('../../constants/HomeConstants'); 

/* DAIAD Logo */
function MainLogo() {
  return (
    <Link to="/" className="logo" activeClassName="selected">
      <img 
        src={`${IMAGES}/daiad-logo-navy.svg`} 
        alt="DAIAD Logo"
        title="DAIAD"
      />
    </Link>
  );
}

/* User options */

function UserInfo(props) {
  const _t = props.intl.formatMessage;
  return (
    <div className="user-menu" >
      <div title={_t({ id: 'section.profile' })}>
        <Link to="settings/profile">
          <span><b>{props.firstname}</b></span>
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
    const _t = this.props.intl.formatMessage;
    return (
      
      <bs.OverlayTrigger 
        id="notifications-trigger"
        trigger="click"
        title={_t({ id: this.props.item.title })}
        rootClose
        placement="bottom"
        onEnter={() => this.setState({ popover: true })}
        onExit={() => this.setState({ popover: false })}
        overlay={
          <bs.Popover 
            id="notifications-popover"
            title={_t({ id: this.props.item.title })} 
          >
            <div className="scrollable">
              <NotificationList
                notifications={this.props.notifications} 
                linkToNotification={this.props.linkToNotification}
              />
            </div>
            <div className="footer">
              <Link 
                className="notifications-show-all" 
                to="/notifications"
              >
                {_t({ id: 'notifications.showAll' })}
              </Link>
            </div>
          </bs.Popover>
        }
        className="notifications-button" 
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

function NotificationList(props) {
  //const maxLength = NOTIFICATION_TITLE_LENGTH;
  return (
    <div className="notification-list">
      <ul className="list-unstyled">
        {
          props.notifications.map((notification) => {
            const notificationClass = notification.acknowledgedOn ? 'read' : 'unread';
            return (
              <li 
                key={notification.category + notification.id} 
                className={notificationClass} 
              >
                <a 
                  onClick={() => props.linkToNotification({ 
                    id: notification.id, 
                    category: notification.category,
                  })}
                >
                  {
                    notification.title
                  }
                </a>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}
function NotificationArea(props) {
  return (
    <div className="notification-area">
      <div className="notifications notification-item">
        <NotificationMenuItem 
          intl={props.intl}
          item={{
            name: 'notifications',
            title: 'section.notifications',
            image: 'images/svg/info.svg',
            link: '#',
          }}
          unreadNotifications={props.unreadNotifications}
          notifications={props.notifications}
          linkToNotification={props.linkToNotification}
        />
      </div>
    </div>  
  );
}

function ErrorDisplay(props) {
  const { errors, dismissError } = props;
  return errors ? 
    <div className="error-display">
      <a onClick={() => dismissError()} className="error-display-x">x</a>
      <img src={`${IMAGES}/alert.svg`} alt="error" />
      <span className="infobox-error">
        <FormattedMessage id={`errors.${errors}`} />
      </span>
    </div>
    :
    <div />;
}

function Header(props) {   
  const { intl, firstname, isAuthenticated, notifications, linkToNotification, 
    unreadNotifications, logout, deviceCount, setLocale, locale, 
    errors, dismissError } = props;
  return (
    <header className="site-header">
      {
        isAuthenticated ? 
          <div>
            <ErrorDisplay
              intl={intl}
              dismissError={dismissError}
              errors={errors} 
            />
            <MainLogo />
            <div className="top-header-right">
              <NotificationArea
                intl={intl}
                deviceCount={deviceCount}
                notifications={notifications} 
                unreadNotifications={unreadNotifications}
                linkToNotification={linkToNotification}
              />
              <UserInfo
                intl={intl}
                firstname={firstname}
              />
              <Logout
                intl={intl}   
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
                intl={intl}
                setLocale={setLocale}
                locale={locale}
              /> 
            </div>
          </div>
     }
    </header>
  );
}

Header.NotificationList = NotificationList;
module.exports = injectIntl(Header);

