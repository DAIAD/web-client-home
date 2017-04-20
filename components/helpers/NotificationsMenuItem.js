const React = require('react');
const classNames = require('classnames');
const bs = require('react-bootstrap');

const NotificationsList = require('./NotificationsList');

const NotificationsMenuItem = React.createClass({
  getInitialState: function () {
    return {
      hover: false,
      popover: false
    };
  },
  render: function () {
    const hasUnread = this.props.unreadNotifications > 0 ? 'hasUnread' : '';
    const unreadNotifications = hasUnread ? this.props.unreadNotifications : '';
    const { _t, link = 'notifications' } = this.props;
    return (
      <div className="notification-area">
        <div className="notifications notification-item">
          <bs.OverlayTrigger 
            id="notifications-trigger"
            trigger="click"
            title={_t('section.notifications')}
            placement="bottom"
            onEnter={() => this.setState({ popover: true })}
            onExit={() => this.setState({ popover: false })}
            rootClose
            ref={(node) => { this.node = node; }}
            overlay={
              <bs.Popover 
                id="notifications-popover"
                title={_t('section.notifications')}
              >
                <NotificationsList
                  notifications={this.props.notifications} 
                  onItemClick={(id, type) => {
                    this.node.hide();
                    this.props.linkToNotification({ notificationId: id, notificationType: type }); 
                  }}
                  hasMore={!this.props.loading && (this.props.notifications.length < this.props.totalNotifications)}
                  loadMore={this.props.fetchMoreAll}
                />
                <div className="footer">
                  <button 
                    className="btn-a notifications-show-all"
                    onClick={() => {
                      this.node.hide();
                      this.props.goTo(link);
                    }}
                  >
                    {_t('notifications.showAll')}
                  </button>
                </div>
              </bs.Popover>
            }
          >
            <button
              className="btn-a"
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
            </button>
          </bs.OverlayTrigger>  
        </div>
      </div>
    );
  }
});

module.exports = NotificationsMenuItem;
