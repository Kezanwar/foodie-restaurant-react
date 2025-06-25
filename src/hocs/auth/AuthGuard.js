import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from 'components/loading-screen';
import Login from 'pages/guest/Login';
// constants
import { PATH_MISC } from 'routes/paths';
// zustand store
import useAuthStore from 'stores/auth';

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const emailConfirmed = useAuthStore((state) => state.user?.email_confirmed);

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

  return children;
}
