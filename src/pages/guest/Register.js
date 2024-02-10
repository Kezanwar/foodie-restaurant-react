import { Helmet } from 'react-helmet-async';
import { Alert, Stack, Typography, Link } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import AuthLayout from 'layouts/auth';
import { PATH_AUTH } from 'routes/paths';
import RouterLink from 'components/router-link/RouterLink';
import AuthRegisterForm from 'features/auth/AuthRegisterForm';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register | Foodie</title>
      </Helmet>
      <AuthLayout>
        <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
          <Typography variant="h3">Register as a Foodie Partner</Typography>

          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Typography variant="body2">Already a restaurant?</Typography>{' '}
            <RouterLink to={PATH_AUTH.login}>
              <Link variant="subtitle2">Login here</Link>
            </RouterLink>
          </Stack>
        </Stack>

        <Alert icon={<HelpIcon />} severity="success" sx={{ mb: 5 }}>
          Not a Restaurant? <strong>Download our customer app</strong>
        </Alert>
        <AuthRegisterForm />
      </AuthLayout>
    </>
  );
}
