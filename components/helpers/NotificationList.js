const React = require('react');
const InfiniteScroll = require('react-infinite-scroller');

function NotificationList(props) {
  const { notifications, onItemClick, hasMore, loadMore } = props;
  return (
    <div className="notification-list scrollable">
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadMore}
        hasMore={hasMore}
        useWindow={false}
        threshold={10}
      >
        <ul className="list-unstyled">
          {
            notifications.map((notification) => {
              const notificationClass = notification.acknowledgedOn ? 'read' : 'unread';
              return (
                <li 
                  key={notification.id} 
                  className={notificationClass} 
                >
                  <a onClick={() => onItemClick(notification.id, notification.category)}>
                    {
                      notification.title
                    }
                  </a>
                </li>
              );
            })
          }
        </ul>
      </InfiniteScroll>
    </div>
  );
}

module.exports = NotificationList;

