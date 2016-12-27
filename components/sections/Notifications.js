const React = require('react');

const bs = require('react-bootstrap');
const classNames = require('classnames');
const { FormattedRelative } = require('react-intl');

const { IMAGES } = require('../../constants/HomeConstants'); 

const Topbar = require('../layout/Topbar');
const MainSection = require('../layout/MainSection');
const ChartBox = require('../helpers/ChartBox');

function NotificationMessage(props) {
  const { notification, nextMessageId, previousMessageId, 
    setActiveMessageId, infobox } = props;

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
        infobox && infobox.chartData ? 
          <ChartBox {...infobox} />
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

      <div className="notification-pagination">
        {
          previousMessageId != null ? 
            <a 
              className="pull-left" 
              onClick={() => setActiveMessageId(previousMessageId)}
            >
              <img src={`${IMAGES}/arrow-big-left.svg`} alt="previous" />
              <span>Previous</span>
            </a>
            : <span />
        }
        {
          nextMessageId != null ? 
            <a 
              className="pull-right" 
              onClick={() => setActiveMessageId(nextMessageId)}
            >
              <span>Next</span>
              <img src={`${IMAGES}/arrow-big-right.svg`} alt="next" />
            </a>
            : <span />
        }
      </div>
    </div>
  );
}

function NotificationList(props) {
  //const maxLength = NOTIFICATION_TITLE_LENGTH;
  return (
    <div className="notification-list">
      <ul className="list-unstyled">
        {
          props.notifications.map((notification) => {
            const activeClass = notification.id === props.activeMessageId ? ' active' : ''; 
            const notificationClass = notification.acknowledgedOn ? ' read' : ' unread';
            return (
              <li key={notification.id} className={notificationClass + activeClass} >
                <a onClick={() => props.setActiveMessageId(notification.id)}>
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

const Notifications = React.createClass({
  render: function () {
    const { intl, categories, messages: notifications, activeMessageId, 
      previousMessageId, nextMessageId, activeMessage: notification, activeTab, 
      setActiveMessageId, setActiveTab, infobox } = this.props;
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
              {...{ 
                notifications, 
                activeMessageId, 
                previousMessageId, 
                nextMessageId, 
                setActiveMessageId 
              }}
            />   
          </div>
          <div className="notifications-right">
            <NotificationMessage 
              {...{ 
                notification, 
                setActiveMessageId, 
                previousMessageId, 
                nextMessageId, 
                infobox 
              }} 
            />
          </div>
        </div>
        { /* hack for notification window to close after it has been clicked */ }
        <input 
          type="hidden" 
          ref={(i) => { if (i !== null) { i.click(); } } 
          }
        />
      </MainSection>
    );
  }
});

module.exports = Notifications;
