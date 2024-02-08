import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import LoadingScreen from 'components/loading-screen';

import { useAuthContext } from 'hooks/useAuthContext';
import { usePathAfterLogin } from 'hooks/usePathAfterLogin';

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
