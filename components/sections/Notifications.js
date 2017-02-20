const React = require('react');

const bs = require('react-bootstrap');
const classNames = require('classnames');
const { FormattedRelative } = require('react-intl');
const InfiniteScroll = require('react-infinite-scroller');

const { IMAGES } = require('../../constants/HomeConstants'); 

const Topbar = require('../layout/Topbar');
const MainSection = require('../layout/MainSection');
const ChartBox = require('../helpers/ChartBox');
const NotificationList = require('../helpers/NotificationList');

function NotificationMessage(props) {
  const { notification, nextMessageId, previousMessageId, 
    setActiveMessageId, widget } = props;

  return !notification ? 
    <div /> 
    : (
    <div className="notification">
      <h3 className="notification-header">{notification.title}</h3>
      {
        notification.imageEncoded ?
          <img 
            className="notification-img" 
            src={`data:image/png;base64, ${notification.imageEncoded}`} 
            alt="tip" 
          />
          :
            null
      }
      {
        widget && widget.chartData ? 
          <ChartBox {...widget} />
          : null
      } 

      <div className="notification-details">
        <p>{notification.description}</p>
        {
          (() => notification.acknowledgedOn ?
            <div>
              <p style={{ width: '100%', textAlign: 'right', fontSize: '0.8em' }}>
                <i 
                  style={{ marginRight: 5 }}
                  className={classNames('fa', 'fa-md', 'green', 'fa-check')} 
                />
                <FormattedRelative value={notification.acknowledgedOn} />
              </p>
            </div>
            : <span />
           )()
        }
      </div>
    </div>
  );
}

const Notifications = React.createClass({
  render: function () {
    const { intl, categories, messages: notifications, activeMessageId, 
      previousMessageId, nextMessageId, activeMessage: notification, activeTab, 
      setActiveMessageId, setActiveTab, widget, fetchMoreActive, totalInCategory, loading } = this.props;
    const _t = intl.formatMessage;
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
                        title={_t({ id: category.title }) + unreadReminder} 
                      />);
                  })
                } 
              </bs.Tabs>
            </Topbar>

            <NotificationList 
              notifications={notifications}
              onItemClick={setActiveMessageId}
              hasMore={!loading && (notifications.length < totalInCategory)}
              loadMore={fetchMoreActive}
            />
          </div>
          <div className="notifications-right">
            <NotificationMessage 
              {...{ 
                notification, 
                setActiveMessageId, 
                previousMessageId, 
                nextMessageId, 
                widget,
              }} 
            />
          </div>
        </div>
      </MainSection>
    );
  }
});

module.exports = Notifications;
