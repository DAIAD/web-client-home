const React = require('react');
const bs = require('react-bootstrap');

const Topbar = require('../../layout/Topbar');
const MainSection = require('../../layout/MainSection');
const NotificationsList = require('../../helpers/NotificationsList');
const Notification = require('./Notification');

const Notifications = React.createClass({
  render: function () {
    const { _t, categories, messages: notifications, activeMessageId, 
      previousMessageId, nextMessageId, activeMessage: notification, activeTab, 
      setActiveMessage, setActiveTab, widget, fetchMoreActive, totalInCategory, tweetMessage, loading } = this.props;
    return (
      <MainSection id="section.notifications">
        <div className="notifications">
          <div className="notifications-left">
            <Topbar> 
              <bs.Tabs 
                position="top" 
                tabWidth={5} 
                activeKey={activeTab} 
                onSelect={key => setActiveTab(key)}
              >
                {
                  categories.map((category) => {
                    const unreadReminder = category.unread && category.unread > 0 ? 
                      ` (${category.unread})` : '';
                    return (
                      <bs.Tab 
                        key={category.id} 
                        eventKey={category.id} 
                        title={_t(category.title) + unreadReminder} 
                      />);
                  })
                } 
              </bs.Tabs>
            </Topbar>

            <NotificationsList 
              notifications={notifications}
              onItemClick={setActiveMessage}
              hasMore={!loading && (notifications.length < totalInCategory)}
              loadMore={fetchMoreActive}
              activeId={activeMessageId}
            />
          </div>
          <div className="notifications-right">
            <Notification
              {...{ 
                notification, 
                setActiveMessage, 
                previousMessageId, 
                nextMessageId, 
                widget,
                tweetMessage,
              }} 
            />
          </div>
        </div>
      </MainSection>
    );
  }
});

module.exports = Notifications;
