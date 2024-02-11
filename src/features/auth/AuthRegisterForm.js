import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useGoogleLogin } from '@react-oauth/google';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Typography,
  Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from 'hooks/useAuthContext';
// components
import Iconify from 'components/iconify';
import FormProvider, { RHFTextField } from 'components/hook-form';
import CustomTooltip from 'components/custom-tooltip/CustomTooltip';

import { RegisterSchema } from 'validation/auth';
import { auth_tooltips } from 'constants/tooltips.constants';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import GOOGLE from 'assets/icons/google.svg';

// ----------------------------------------------------------------------

export default function AuthRegisterForm() {
  const { register, registerWithGoogle } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: ''
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
      await register(
        data.email,
        data.password,
        data.first_name,
        data.last_name
      );
      mixpanelTrack(MIXPANEL_EVENTS.register_success, {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name
      });
    } catch (error) {
      console.error(error);

      mixpanelTrack(MIXPANEL_EVENTS.register_failed, {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        error: error?.message || JSON.stringify(error)
      });
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error
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

    mixpanelTrack(MIXPANEL_EVENTS.register_form_errors, {
      errors: data
    });
  }, []);

  const onGoogleSuccess = async (codeResponse) => {
    try {
      await registerWithGoogle(codeResponse?.access_token);
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'Unexpected error'
      });
    }
  };

  const googleRegister = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await onGoogleSuccess(codeResponse);
    },
    onError: (error) => {
      setError('afterSubmit', {
        ...error,
        message: error?.message || 'Google register failed'
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={2}>
        <Stack direction="row" gap={2}>
          <RHFTextField
            placeholder={'e.g John'}
            name="first_name"
            label="First name"
          />
          <RHFTextField
            name="last_name"
            placeholder={'e.g Smith'}
            label="Last name"
          />
        </Stack>

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
        <RHFTextField
          name="confirm_password"
          label="Confirm password"
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
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
      </Stack>

      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        sx={{ mt: 2, mb: 4 }}
      >
        <CustomTooltip
          tooltipText={auth_tooltips.password_requirements.tooltip}
        />
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
        Register
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
        onClick={googleRegister}
      >
        <img
          alt="google"
          style={{ marginRight: 8, height: 20, width: 20 }}
          src={GOOGLE}
        />
        Sign up with Google
      </Button>
    </FormProvider>
  );
}
