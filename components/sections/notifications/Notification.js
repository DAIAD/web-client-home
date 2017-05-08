const React = require('react');
const bs = require('react-bootstrap');
const classNames = require('classnames');
const { FormattedMessage, FormattedRelative } = require('react-intl');

const { ChartWidget } = require('../../helpers/Widgets');

const { IMAGES, BASE64 } = require('../../../constants/HomeConstants'); 

function Notification(props) {
  const { notification, nextMessageId, previousMessageId, 
    setActiveMessage, widget, tweetMessage } = props;
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
          notification.acknowledgedOn ?
            <div className="acknowledged">
              <i className={classNames('fa', 'fa-md', 'green', 'fa-check')} />
              <FormattedRelative value={notification.acknowledgedOn} />
            </div>
            : <span />
        }
      </div>
      <div className="notification-pagination">
        {
          previousMessageId != null ? 
            <button 
              className="btn-a" 
              onClick={() => setActiveMessage(previousMessageId, notification.type)}
            >
              <img alt="previous" src={`${IMAGES}/arrow-big-left.svg`} />
              <FormattedMessage id="forms.previous" />
            </button>
           : 
           <span style={{ width: 118 }} />
        }
        { notification.type === 'RECOMMENDATION_STATIC' ?
          <div className="tweet">
            <a 
              href={`https://twitter.com/intent/tweet?text=${notification.description}`}
              onClick={(e) => {
                tweetMessage(notification.id);
              }}
            >
              <i className={classNames('fa', 'fa-md', 'navy', 'fa-twitter')} />
            </a>
          </div>
          :
          <span style={{ width: 16 }} />
        }
        {
          nextMessageId != null ? 
            <button 
              className="btn-a" 
              onClick={() => setActiveMessage(nextMessageId, notification.type)}
            >
              <FormattedMessage id="forms.next" />
              <img alt="next" src={`${IMAGES}/arrow-big-right.svg`} />
            </button>
            : 
            <span style={{ width: 93 }} />
        }
      </div>
    </div>
  );
}

module.exports = Notification;
