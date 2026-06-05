import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import DashboardIcon from '../../../components/layout/icons/DashboardIcon'
import CarIcon from '../../../components/layout/icons/CarIcon';
import CalendarIcon from '../../../components/layout/icons/CalendarIcon';
import UsersIcon from '../../../components/layout/icons/UsersIcon';
import Building from '../../../components/layout/icons/Building';
import SettingsIcon from '../../../components/layout/icons/SettingsIcon';
import Logout from '../../../components/layout/icons/Logout';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../../../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import '../../../styles/pages/dashboard.css'; 
import ChartIcon from "../../../components/layout/icons/ChartIcon";

const Sidebaradmin = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const tohome=()=>{
    navigate('/')
  }
  const handlelogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      navigate('/login'); 
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/login');
    } 
  };


  const adminMenu = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: DashboardIcon },
    { name: 'Agences', path: '/dashboard/admin/agencies', icon: UsersIcon },
    { name: 'Voitures', path: '/dashboard/admin/cars', icon: CarIcon },
    { name: 'Utilisateurs', path: '/dashboard/admin/users', icon: UsersIcon },
    { name: 'Réservations', path: '/dashboard/admin/bookings', icon: CalendarIcon },
    { name: 'Statistiques', path: '/dashboard/admin/stats', icon: ChartIcon },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={tohome}>
        <div className="logo-icon">
          <CarIcon width={24} height={24} stroke="white" />
        </div>
        <span>AutoConnect Admin</span>
      </div>

      {/* Menu Navigation */}
      <nav className="nav-menu">
        <p className="nav-label">Administration</p>
        <ul className="nav-list">
{adminMenu.map((item) => {
  const Icon = item.icon;

  const isActive =
    item.path === "/dashboard/admin"
      ? location.pathname === "/dashboard/admin"
      : location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/");

  return (
    <li key={item.path}>
      <Link
        to={item.path}
        className={`nav-item ${isActive ? "active" : ""}`}
      >
        <span className={`nav-icon ${isActive ? "nav-icon-active" : ""}`}>
          <Icon
            stroke={
              isActive
                ? "var(--color-primary-500)"
                : "var(--color-text-secondary)"
            }
          />
        </span>
        {item.name}
      </Link>
    </li>
  );
})}
        </ul>
      </nav>

      {/* Logout fixe en bas */}
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handlelogout}>
          <Logout/>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebaradmin;