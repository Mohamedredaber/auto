import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSelectors';
import BellIcon from '../icons/BellIcon';
import '../../../styles/pages/dashboard.css'; 

const TopBar = () => {
  const user = useSelector(selectUser);
  const role = user?.role;
  const agency = user?.agency;

  return (
    <header className="top-bar">
      <div className="top-bar-left">
    
      </div>

      <div className="top-bar-right">
        {/* <button className="icon-btn" title="Notifications">
          <BellIcon width={20} height={20} stroke="var(--color-text-muted)" />
          <span className="notification-dot"></span>
        </button> */}

        <div className="divider-v"></div>

        <div className="user-info-wrapper">
          <div className="user-details">
            <span className="user-name">
              {user?.full_name || `${user?.first_name} ${user?.last_name}`}
            </span>

              <span className="user-role">{ role === "agency_manager" ? "Agency Manager" : "dashboard user"   }</span>
          </div>
          
     
      {role === "agency_manager" && agency &&
          <div className="agency-avatar"> 
            <img
              src={agency?.logo_url}
              alt={agency?.agency_name || "Logo"}        />
          </div>}
        </div>
      </div>
    </header>
  );
};

export default TopBar;