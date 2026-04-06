import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSelectors';
import BellIcon from '../icons/BellIcon';
import '../../../styles/pages/dashboard.css'; 

const TopBar = () => {
  // Kan-jbdou l-user m-connecti (fih full_name o agency)
  const user = useSelector(selectUser);
  const agency = user?.agency;

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {/* Hna t9der t-zid path bhal: Dashboard > Overview */}
      </div>

      <div className="top-bar-right">
        {/* Notification Button avec l'icône Bell li drna */}
        <button className="icon-btn" title="Notifications">
          <BellIcon width={20} height={20} stroke="var(--color-text-muted)" />
          <span className="notification-dot"></span>
        </button>

        <div className="divider-v"></div>

        <div className="user-info-wrapper">
          <div className="user-details">
            <span className="user-name">
              {user?.full_name || `${user?.first_name} ${user?.last_name}`}
            </span>
            <span className="user-role">Agency Manager</span>
          </div>
          
          <div className="agency-avatar">
            <img
              src={agency?.logo_url || "/default-agency.png"}
              alt={agency?.agency_name || "Logo"}
              onError={(e) => { e.target.src = "/default-agency.png"; }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;