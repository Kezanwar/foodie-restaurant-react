import mixpanel from 'mixpanel-browser';
import { QueryClient, QueryClientProvider } from 'react-query';

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
import { ENVIRONMENT, MIXPANEL_API_KEY } from './config';

// ----------------------------------------------------------------------

export default function App() {
  mixpanel.init(MIXPANEL_API_KEY, { debug: ENVIRONMENT === 'DEVELOPMENT' });
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
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
  );
}
