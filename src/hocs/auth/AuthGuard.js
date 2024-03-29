import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from 'components/loading-screen';
//
import Login from 'pages/guest/Login';
import { useAuthContext } from 'hooks/useAuthContext';
import { PATH_MISC } from 'routes/paths';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, emailConfirmed } = useAuthContext();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (isAuthenticated && !emailConfirmed) {
    return <Navigate to={PATH_MISC.confirm_email} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
