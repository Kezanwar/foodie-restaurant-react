import { Helmet } from 'react-helmet-async';
import { Alert, Link, Stack, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import AuthLayout from 'layouts/auth/AuthLayout';

import RouterLink from 'components/router-link/RouterLink';
import { PATH_AUTH } from 'routes/paths';
import AuthLoginForm from 'features/auth/AuthLoginForm';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Foodie</title>
      </Helmet>

      <AuthLayout>
        <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
          <Typography variant="h3">
            Sign in to your Partner Dashboard
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">New user?</Typography>

            <RouterLink to={PATH_AUTH.register}>
              <Link variant="subtitle2">Create an account</Link>
            </RouterLink>
          </Stack>
        </Stack>

        <Alert icon={<HelpIcon />} severity="success" sx={{ mb: 5 }}>
          Not a restaurant? <strong>Download our customer app</strong>
        </Alert>

        <AuthLoginForm />
      </AuthLayout>
    </>
  );
}
