import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Button,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../hooks/useAuthContext';
// components
import Iconify from '../../components/iconify';
import GOOGLE from '../../assets/icons/google.svg';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Spacer from '../../components/spacer/Spacer';
import { LoginSchema } from '../../validation/auth';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login, loginWithGoogle } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: '',
    password: ''
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      mixpanelTrack(MIXPANEL_EVENTS.login_success, {
        email: data.email
      });
    } catch (error) {
      console.error(error);
      mixpanelTrack(MIXPANEL_EVENTS.login_failed, {
        email: data.email,
        error: error?.message || JSON.stringify(error)
      });
      reset();

      setError('afterSubmit', {
        ...error,
        message: error?.message || 'Unexpected error'
      });
    }
  };

  const onError = useCallback((errors) => {
    const errArr = Object.entries(errors);
    errArr.forEach(([name, value]) =>
      value?.message
        ? enqueueSnackbar(value.message, { variant: 'error' })
        : null
    );

    const data = { ...errors };

    mixpanelTrack(MIXPANEL_EVENTS.login_form_errors, {
      errors: data
    });
  }, []);

  const onGoogleSuccess = async (codeResponse) => {
    try {
      await loginWithGoogle(codeResponse?.access_token);
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'Unexpected error'
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await onGoogleSuccess(codeResponse);
    },
    onError: (error) => {
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'Google login failed'
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={2}>
        <RHFTextField
          placeholder={'e.g your@email.com'}
          name="email"
          label="Email address"
        />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {!!errors.afterSubmit && (
          <>
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
            <Spacer />
          </>
        )}
      </Stack>

      <Stack alignItems="flex-end" sx={{ mt: 2, mb: 4 }}>
        <Link variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) =>
            theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) =>
              theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
          }
        }}
      >
        Login
      </LoadingButton>
      <Typography variant="body2" textAlign={'center'} my={2}>
        {' '}
        - Or -{' '}
      </Typography>
      {/* <GoogleLogin onSuccess={() => {}} onError={() => {}} /> */}
      <Button
        sx={{ display: 'flex', width: '100%', textTransform: 'initial' }}
        color="inherit"
        variant="outlined"
        size="large"
        onClick={googleLogin}
      >
        <img
          alt="google"
          style={{ marginRight: 8, height: 20, width: 20 }}
          src={GOOGLE}
        />
        Sign in with Google
      </Button>
    </FormProvider>
  );
}
