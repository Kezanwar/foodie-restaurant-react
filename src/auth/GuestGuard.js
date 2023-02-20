import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// components
import LoadingScreen from '../components/loading-screen';
import { RESTAURANT_STATUS } from '../constants/restaurants.constants';
//
import { useAuthContext } from '../hooks/useAuthContext';
import { usePathAfterLogin } from '../hooks/usePathAfterLogin';
import { PATH_DASHBOARD, PATH_NEW_RESTAURANT } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  const p = usePathAfterLogin();

  if (isAuthenticated) {
    return <Navigate to={p} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
