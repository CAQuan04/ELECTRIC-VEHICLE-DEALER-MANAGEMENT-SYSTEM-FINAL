import React from 'react';
import PropTypes from 'prop-types';

const ActivityList = ({ title = "Recent Activities", activities = [] }) => {
  return (
    <div className="activity-list">
      <h3>{title}</h3>
      <div className="activity-items">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="activity-item">
              {activity.icon && (
                <div className="activity-icon">
                  {activity.icon}
                </div>
              )}
              <div className="activity-content">
                <p className="activity-title">{activity.title}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
              {activity.status && (
                <span className={`activity-status status-${activity.status}`}>
                  {activity.status}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="activity-empty">
            <p>No activities to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

ActivityList.propTypes = {
  title: PropTypes.string,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.string
    })
  )
};

export default ActivityList;