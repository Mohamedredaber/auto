import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import WaitingVerification from '../pages/agency/WaitingVerification'; // الصفحة لي غادي نصاوبو
import { selectUser } from '../features/auth/authSelectors';
const VerificationRoute = () => {
  const user = useSelector(selectUser);
  const role = user?.role;
  console.log("User role in VerificationRoute:", role);
  const verificationStatus = user?.agency?.is_verified;

  if (verificationStatus !== 'verified') {
    return <WaitingVerification />;
  }
  return <Outlet />;
};

export default VerificationRoute;