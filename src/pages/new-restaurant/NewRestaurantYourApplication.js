import React, { useCallback, useEffect, useState } from 'react';
import { Stack } from '@mui/system';
import {
  Alert,
  AlertTitle,
  Typography,
  Box,
  Button,
  useMediaQuery
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Image from 'mui-image';
import { useNavigate } from 'react-router';
import HelpIcon from '@mui/icons-material/Help';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';

// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useTheme } from '@emotion/react';

import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import LikeLottie from '../../assets/lottie/like-button.json';

import { pageScrollToTop } from '../../utils/scroll';
import Subheader from '../../components/subheader/Subheader';
import Spacer from '../../components/spacer/Spacer';

import MotionDivViewport from '../../components/animate/MotionDivViewport';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import useLocationsQuery from '../../hooks/queries/useLocationsQuery';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import RestaurantProfileIphone from '../../features/iphone/RestaurantProfileIphone';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import FormProvider from '../../components/hook-form/FormProvider';
import useCreateRestaurantGuard from '../../hooks/useCreateRestaurantGuard';

import { submitApplicationSchema } from '../../validation/new-restaurant.validation';
import { RHFCheckbox } from '../../components/hook-form';

import { postSubmitApplicationStep } from '../../utils/api';

import { RESTAURANT_STATUS } from '../../constants/restaurants.constants';
import useRHFErrorMixpanelTracker from '../../hooks/useRHFErrorMixpanelTracker';
import { MIXPANEL_EVENTS, mixpanelTrack } from '../../utils/mixpanel';

import { useAuthContext } from '../../hooks/useAuthContext';

const NewRestaurantYourApplication = (props) => {
  const { isTablet, isMobile } = useCustomMediaQueries();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const isSmallMobile = useMediaQuery((theme) => theme.breakpoints.down(390));

  useEffect(() => {
    pageScrollToTop();
  }, []);

  const { data, updateQuery } = useRestaurantQuery();

  useCreateRestaurantGuard(data?.data, PATH_NEW_RESTAURANT.step_4);

  const locationsQuery = useLocationsQuery();

  const locations = locationsQuery?.data?.data || null;

  const { avatar, name, bio, company_info, cover_photo, social_media } =
    data?.data || {};

  const { company_address, company_name, company_number } = company_info || {};

  const theme = useTheme();

  const handleBack = () => navigate(PATH_NEW_RESTAURANT.step_3);
  const handleNext = () => {};

  const defaultValues = {
    terms_and_conditions: false,
    privacy_policy: false
  };

  const methods = useForm({
    resolver: yupResolver(submitApplicationSchema),
    defaultValues
  });

  const { handleSubmit, getValues, formState, setError } = methods;

  const onSubmit = async (data) => {
    try {
      const updatedRestaurant = await postSubmitApplicationStep(data);
      updateQuery(updatedRestaurant?.data);
      setFormSubmitLoading(false);
      //   setSuccessModalOpen(true);
    } catch (error) {
      console.error(error);

      setError('afterSubmit', {
        ...error,
        message: error.message
      });
      setFormSubmitLoading(false);
    }
  };

  const hasSubmit =
    data?.data?.status === RESTAURANT_STATUS.APPLICATION_PROCESSING;

  const onError = useCallback(
    (errors) => {
      const errArr = Object.entries(errors);
      errArr.forEach(([name, value]) =>
        value?.message
          ? enqueueSnackbar(value.message, { variant: 'error' })
          : null
      );

      const data = { ...errors };
      if (user?.email) {
        data.auth = user;
      }
      mixpanelTrack(
        MIXPANEL_EVENTS.create_restaurant_submit_application_errors,
        {
          errors: data
        }
      );
    },
    [user?.email]
  );

  if (!data?.data || !locations) return <LoadingScreen />;

  return (
    <Box>
      <Helmet>
        <title> Step 4 | Submit Application - Foodie</title>
      </Helmet>
      <Stack
        mb={isMobile ? -4 : 8}
        sx={{
          margin: '0 auto',
          width: isTablet ? '100%' : '70%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Alert icon={<HelpIcon />} severity={'success'}>
          <AlertTitle>Review your application</AlertTitle>
          {!hasSubmit
            ? 'Thanks for filling out the application process.'
            : 'Thank you for submittin your application'}
          {!hasSubmit && (
            <>
              <Box mt={1}>
                Please review the details about your company and how your
                restaurant will look on our mobile app below before submitting
                you application.
              </Box>
              <Box mt={2}>
                <strong>Before submitting </strong>
                <Box mt={1}>
                  <li>
                    Review your restaurant profile and go back to make any
                    neccessary changes{' '}
                  </li>
                  <li>Accept our terms and conditions </li>
                </Box>
              </Box>
            </>
          )}
          <Box mt={2}>
            <strong>Once accepted </strong>
            <Box mt={1}>
              <li>
                Your restaurant profile and locations can be{' '}
                <strong>updated at any time from your dashboard.</strong>
              </li>
              <li>
                You can browse the dashboard and manage your account, but you
                must{' '}
                <strong>
                  {' '}
                  setup your subscription before creating a deal{' '}
                </strong>
              </li>
            </Box>
          </Box>
        </Alert>
        <Spacer sp={6} />
        <Stack width={'100%'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-around'
            }}
          >
            <Box>
              <Subheader text={'Company Name'} />
              <Spacer sp={1} />
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_name || ''}
              </Typography>
            </Box>
            <Box>
              <Subheader text={'Company Address'} />
              <Spacer sp={1} />
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.address_line_1 || ''}
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.address_line_2 || ''}
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word' }}
                fontSize={16}
              >
                {company_address?.postcode || ''}
              </Typography>
            </Box>
            {company_number && (
              <Box>
                <Subheader text={'Company Number'} />
                <Spacer sp={1} />
                <Typography
                  variant="body2"
                  sx={{ wordBreak: 'break-word' }}
                  fontSize={16}
                >
                  {company_number}
                </Typography>
              </Box>
            )}
          </Box>
          <Spacer sp={isMobile ? 0 : 6} />
          <RestaurantProfileIphone />
        </Stack>
        <Spacer sp={isMobile ? 0 : 6} />
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Stack alignItems={'center'}>
            <RHFCheckbox
              isCentered={!isMobile}
              name={'terms_and_conditions'}
              label={'I accept the Foodie platform Terms and Conditions'}
            />
            <Spacer sp={0.5} />
            <RHFCheckbox
              isCentered={!isMobile}
              name={'privacy_policy'}
              label={'I accept the Foodie platform Privacy Policy '}
            />
          </Stack>
          <Box
            mt={4}
            sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <Button color="inherit" onClick={handleBack} sx={{ mr: 2 }}>
              Back
            </Button>
            <LoadingButton
              loading={formSubmitLoading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
          </Box>
        </FormProvider>
      </Stack>
    </Box>
  );
};

NewRestaurantYourApplication.propTypes = {};

export default NewRestaurantYourApplication;
