import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/guest/LoginPage';
import { useAuthContext } from '../hooks/useAuthContext';
import { RESTAURANT_STATUS } from '../constants/restaurants.constants';
import { PATH_NEW_RESTAURANT } from '../routes/paths';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const {
    isAuthenticated,
    isInitialized,
    initialRestaurantStatus,
    emailConfirmed
  } = useAuthContext();

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

  console.log(emailConfirmed);

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
