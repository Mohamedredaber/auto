import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectRole } from "../../../../features/auth/authSelectors";
import { Link } from 'react-router-dom';
function MyEspace() {
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const getButtonLabel = () => {
    switch (role) {
      case 'admin':
        return "Administration";
      case 'agency':
        return "Dashboard Agence";
      case 'client':
        return `Espace ${user.firstname || user.name || 'Client'}`;
      default:
        return "Mon Compte";
    }
  };
  return (
    <Link to={role === 'admin' ? '/dashboard/admin' : role === 'agency' ? '/dashboard/agency' : '/dashboard/client'} className='navbar__btn navbar__btn--primary'>
        {getButtonLabel()}
    </Link>
  );
}

export default MyEspace;