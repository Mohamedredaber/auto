import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import DashboardIcon from '../../../components/layout/icons/DashboardIcon'
import CarIcon from '../../../components/layout/icons/CarIcon';
import CalendarIcon from '../../../components/layout/icons/CalendarIcon';
import UsersIcon from '../../../components/layout/icons/UsersIcon';
import Logout from '../../../components/layout/icons/Logout';
import { useDispatch , } from 'react-redux';
import { logoutThunk } from '../../../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import '../../../styles/pages/dashboard.css'; 

const Sidebaradmin = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handlelogout = async () => {
    try {
    await dispatch(logoutThunk()).unwrap();
    navigate('/login'); 
  } catch (error) {
    console.error("Logout error:", error);
    navigate('/login');
  } 
  };


  const agencyMenu = [
    { name: 'Dashboard', path: '/dashboard/agency', icon: DashboardIcon },
    { name: 'Statistiques', path: '/dashboard/agency/statistics', icon: DashboardIcon },
    { name: 'Mes Voitures', path: '/dashboard/agency/cars', icon: CarIcon },
    { name: 'Réservations', path: '/dashboard/agency/reservations', icon: CalendarIcon },
    { name: 'Clients', path: '/dashboard/agency/clients', icon: UsersIcon },
  ];

  return (
    <aside className="sidebar">
    
      <div className="sidebar-logo">
        <div className="logo-icon">
          <CarIcon width={24} height={24} stroke="white" />
        </div>
        <span>AutoConnect</span>
      </div>

      {/* Menu Navigation */}
      <nav className="nav-menu">
        <p className="nav-label">Gestion Agence</p>
        <ul className="nav-list">
          {agencyMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
                    <Icon stroke={isActive ? "var(--color-blue-500)" : "var(--color-text-secondary)"} />
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
        <button className="btn-logout"
        onClick={handlelogout}
        >
          <Logout/>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebaradmin;