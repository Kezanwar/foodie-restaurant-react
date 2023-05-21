import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../hooks/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Spacer from '../../components/spacer/Spacer';
import { LoginSchema } from '../../validation/auth.validation';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';
import useRHFErrorMixpanelTracker from '../../hooks/useRHFErrorMixpanelTracker';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login } = useAuthContext();
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={2}>
        <RHFTextField name="email" label="Email address" />
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
    </FormProvider>
  );
}
