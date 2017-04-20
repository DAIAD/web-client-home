'use strict';

var React = require('react');
var classNames = require('classnames');
var InfiniteScroll = require('react-infinite-scroller');

function NotificationList(props) {
  var notifications = props.notifications,
      onItemClick = props.onItemClick,
      hasMore = props.hasMore,
      loadMore = props.loadMore,
      activeId = props.activeId;

  return React.createElement(
    'div',
    { className: 'notification-list scrollable' },
    React.createElement(
      InfiniteScroll,
      {
        pageStart: 0,
        initialLoad: false,
        loadMore: loadMore,
        hasMore: hasMore,
        useWindow: false,
        threshold: 10
      },
      React.createElement(
        'ul',
        { className: 'list-unstyled' },
        notifications.map(function (notification) {
          var notificationClass = notification.acknowledgedOn ? 'read' : 'unread';
          var activeClass = notification.id === activeId ? 'active' : '';
          return React.createElement(
            'li',
            {
              key: notification.id,
              className: classNames(notificationClass, activeClass)
            },
            React.createElement(
              'button',
              {
                className: 'btn-a',
                onClick: function onClick() {
                  return onItemClick(notification.id, notification.type);
                }
              },
              React.createElement('i', null),
              React.createElement(
                'span',
                null,
                notification.title
              )
            )
          );
        })
      )
    )
  );
}

module.exports = NotificationList;