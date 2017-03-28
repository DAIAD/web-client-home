const React = require('react');

const bs = require('react-bootstrap');
const classNames = require('classnames');
const { FormattedRelative } = require('react-intl');

const { IMAGES, BASE64 } = require('../../constants/HomeConstants'); 

const Topbar = require('../layout/Topbar');
const MainSection = require('../layout/MainSection');
const { ChartWidget } = require('../helpers/Widgets');
const NotificationList = require('../helpers/NotificationList');

function NotificationMessage(props) {
  const { notification, nextMessageId, previousMessageId, 
    setActiveMessage, widget } = props;
  return !notification ? 
    <div /> 
    : (
    <div className="notification">
      <h3 className="notification-header">{notification.title}</h3>
      {
        notification.imageEncoded ?
          <img 
            className="notification-img" 
            src={`${BASE64}${notification.imageEncoded}`} 
            alt="tip" 
          />
          :
            null
      }
      {
        widget && widget.chartData ? 
          <ChartWidget 
            height={300}
            {...widget} 
          />
          : null
      } 

      <div className="notification-details">
        <p>{notification.description}</p>
        {
          (() => notification.acknowledgedOn ?
            <div className="acknowledged">
              <i className={classNames('fa', 'fa-md', 'green', 'fa-check')} />
              <FormattedRelative value={notification.acknowledgedOn} />
            </div>
            : <span />
           )()
        }
      </div>
      <div className="notification-pagination">
        {
          previousMessageId != null ? 
            <a className="pull-left" onClick={() => setActiveMessage(previousMessageId, notification.type)}>
              <img alt="previous" src={`${IMAGES}/arrow-big-left.svg`} /><span>Previous</span>
            </a>
        : <span />
        }
        {
          nextMessageId != null ? 
            <a className="pull-right" onClick={() => setActiveMessage(nextMessageId, notification.type)}>
              <span>Next</span><img alt="next" src={`${IMAGES}/arrow-big-right.svg`} />
            </a>
            : <span />
        }
      </div>
    </div>
  );
}

const Notifications = React.createClass({
  render: function () {
    const { _t, categories, messages: notifications, activeMessageId, 
      previousMessageId, nextMessageId, activeMessage: notification, activeTab, 
      setActiveMessage, setActiveTab, widget, fetchMoreActive, totalInCategory, loading } = this.props;
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

            <NotificationList 
              notifications={notifications}
              onItemClick={setActiveMessage}
              hasMore={!loading && (notifications.length < totalInCategory)}
              loadMore={fetchMoreActive}
              activeId={activeMessageId}
            />
          </div>
          <div className="notifications-right">
            <NotificationMessage 
              {...{ 
                notification, 
                setActiveMessage, 
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
