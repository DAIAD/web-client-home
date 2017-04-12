const React = require('react');
const bs = require('react-bootstrap');
const classNames = require('classnames');
const { FormattedMessage, FormattedRelative } = require('react-intl');

const { ChartWidget } = require('../../helpers/Widgets');

const { IMAGES, BASE64 } = require('../../../constants/HomeConstants'); 

function Notification(props) {
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
              <img alt="previous" src={`${IMAGES}/arrow-big-left.svg`} />
              <FormattedMessage id="forms.previous" />
            </a>
        : <span />
        }
        {
          nextMessageId != null ? 
            <a className="pull-right" onClick={() => setActiveMessage(nextMessageId, notification.type)}>
              <FormattedMessage id="forms.next" />
              <img alt="next" src={`${IMAGES}/arrow-big-right.svg`} />
            </a>
            : <span />
        }
      </div>
    </div>
  );
}

module.exports = Notification;
