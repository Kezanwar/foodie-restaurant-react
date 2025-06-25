import { Navigate } from 'react-router-dom';
import useAuthStore from 'stores/auth';

export default function GuestGuard({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={'/dashboard/overview'} />;
  }

  return children;
}
