//    ___                __ __
//  .'  _.-----.-----.--|  |__.-----.
//  |   _|  _  |  _  |  _  |  |  -__|
//  |__| |_____|_____|_____|__|_____|

import mixpanel from 'mixpanel-browser';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';

// routes
import Router from './routes';

// providers
import { AuthProvider } from './auth/AuthContext';
import ThemeProvider from './theme';
import SnackbarProvider from './components/snackbar';
import UtilityProvider from './context/utility/UtilityContext';

// components
import { MotionLazyContainer } from './components/animate';

// config
import { ENVIRONMENT, GOOGLE_CLIENT_ID, MIXPANEL_API_KEY } from './config';

// ----------------------------------------------------------------------

export default function App() {
  mixpanel.init(MIXPANEL_API_KEY, { debug: ENVIRONMENT === 'DEVELOPMENT' });
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        {ENVIRONMENT === 'DEVELOPMENT' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <AuthProvider>
          <UtilityProvider>
            <MotionLazyContainer>
              <ThemeProvider>
                <SnackbarProvider>
                  <Router />
                </SnackbarProvider>
              </ThemeProvider>
            </MotionLazyContainer>
          </UtilityProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
