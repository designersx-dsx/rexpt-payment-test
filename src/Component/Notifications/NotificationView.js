
import React, { useEffect, useState } from 'react';
import styles from './NotificationView.module.css';
import { useNotificationStore } from '../../Store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { markNotificationAsSeen } from '../../Store/apiStore';

const NotificationView = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(30); // Initial 30 notifications
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const navigate = useNavigate();
  const [notificationStatus, setNotificationStatus] = useState([]);

  sessionStorage.setItem('naviateFrom', 'notifications');

  useEffect(() => {
    if (!notifications) return;
    setNotificationStatus(notifications.map((n) => ({ id: n.id, status: n.status || 'unread' })));
  }, [notifications]);

  const toggleAccordion = async (id,type) => {
    if (expandedId !== id) {
      // Mark as seen when opening
      const notification = notificationStatus.find((n) => n.id === id);
      console.log('notification',notification)
      if (notification.status === 'unread') {
      
        const response = await markNotificationAsSeen(id,type);
        // console.log('response', response);
        if (response.success) {
          setNotificationStatus((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, status: 'read' } : n
            )
          );

          setNotifications(
            notifications.map((n) =>
              n.id === id ? { ...n, status: 'read' } : n
            )
          );
        }
      }
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 50); // Load 50 more notifications
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'normal':
        return styles.normalPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return styles.normalPriority;
    }
  };

  const getTypeBorder = (type) => {
    switch (type) {
      case 'alert':
        return styles.alertBorder;
      case 'info':
        return styles.infoBorder;
      case 'admin':
        return styles.adminBorder;
      case 'system':
        return styles.systemBorder;
      default:
        return styles.systemBorder;
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={styles.notificationContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img
            src='/svg/back-svg.svg'
            alt='back-svg'
            className={styles.backIcon}
            onClick={() => navigate(-1)}
          />
          <h2 className={styles.headerTitle}>Notifications</h2>
        </div>
      </header>

      <div className={styles.notificationList}>
        {notifications.length === 0 ? (
          <p className={styles.noNotifications}>No notifications available</p>
        ) : (
          notifications.slice(0, visibleCount).map((notification) => {
            const isRead = notificationStatus.find((n) => n.id === notification.id)?.status === 'read';
            return (
              <div
                key={notification.id}
                className={`${styles.notificationCard} ${
                  expandedId === notification.id ? styles.expanded : ''
                } ${getTypeBorder(notification.type)} ${isRead ? styles.read : styles.unread}`}
              >
                <div
                  className={styles.notificationHeader}
                  onClick={() => toggleAccordion(notification.id,notification.type)}
                >
                  <div className={styles.notificationInfo}>
                    <div className={styles.titleWrapper}>
                      <h3 className={styles.notificationTitle}>
                        {notification.title || 'System Notification'}
                      </h3>
                      {/* <span className={`${styles.priority} ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span> */}
                    </div>
                    <p className={styles.notificationTime}>
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                  <svg
                    className={`${styles.arrow} ${
                      expandedId === notification.id ? styles.arrowUp : ''
                    }`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="#24252C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`${styles.notificationContent} ${
                    expandedId === notification.id ? styles.show : ''
                  }`}
                >
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  {notification.clickAction && (
                    <span
                      onClick={() => navigate(notification.clickAction)}
                      className={styles.actionLink}
                    >
                      Take Action
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {visibleCount < notifications.length && (
        <button className={styles.loadMoreButton} onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default NotificationView;