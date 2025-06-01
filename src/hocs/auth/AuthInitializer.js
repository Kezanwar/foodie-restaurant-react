import LoadingScreen from 'components/loading-screen';
import React, { useEffect } from 'react';
import useAuthStore from 'stores/auth';

const AuthInitializer = ({ children }) => {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      useAuthStore.getState().initialize();
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthInitializer;
