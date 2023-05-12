import React, { useCallback, useMemo } from 'react';
import Image from 'mui-image';
import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Container } from '@mui/system';
import { Box, Button, Stack, Typography } from '@mui/material';

import Spacer from '../../components/spacer/Spacer';
import MotionDivViewport from '../../components/animate/MotionDivViewport';
import UndrawSVG from '../../assets/undraw-content-team-8.svg';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { useAuthContext } from '../../hooks/useAuthContext';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import {
  RESTAURANT_REG_STEPS,
  RESTAURANT_STATUS
} from '../../constants/restaurants.constants';
import RestaurantProfileIphone from '../../features/iphone/RestaurantProfileIphone';

const NewRestaurantGetStarted = (props) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useCustomMediaQueries();
  const { data } = useRestaurantQuery();

  // eslint-disable-next-line consistent-return
  const getContent = useCallback(() => {
    const regStep = data?.data?.registration_step;
    const status = data?.data?.status;

    if (status === RESTAURANT_STATUS.APPLICATION_REJECTED) {
      return {
        mainText:
          'Your application was rejected, please check your email for further information.',
        subText:
          'You can contact support@thefoodie.app if you have any queries.',
        strongText: '',
        ctaText: 'Review application',
        ctaTo: PATH_NEW_RESTAURANT.step_4
      };
    }
    if (status === RESTAURANT_STATUS.APPLICATION_PROCESSING) {
      return {
        mainText:
          "Thanks! You're all done - You will receive an email once we've finished processing your application.",
        subText: '',
        strongText: '',
        ctaText: 'Review application',
        ctaTo: PATH_NEW_RESTAURANT.step_4
      };
    }
    if (!regStep)
      return {
        mainText:
          "It looks like you're new here, you'll need to submit a new restaurant application before you can start posting content/deals and tapping into the foodie userbase!",
        subText: 'The application process typically takes',
        strongText: '9-12 minutes',
        ctaText: 'Get started',
        ctaTo: PATH_NEW_RESTAURANT.step_1
      };
    if (regStep) {
      const R_STEP = regStep.split('COMPLETE')[0].slice(0, -1);
      switch (R_STEP) {
        case RESTAURANT_REG_STEPS.STEP_1:
          return {
            mainText:
              "Welcome back, you've completed the first step of your application, pickup where you left off!",
            subText: 'Estimated tme remaining is',
            strongText: '8-10 minutes',
            ctaText: 'Continue with your application',
            ctaTo: PATH_NEW_RESTAURANT.step_2
          };
        case RESTAURANT_REG_STEPS.STEP_2:
          return {
            mainText:
              "Welcome back, you've completed the first two steps of your application, pickup where you left off!",
            subText: 'Estimated tme remaining is',
            strongText: '4-8 minutes',
            ctaText: 'Continue with your application',
            ctaTo: PATH_NEW_RESTAURANT.step_3
          };
        case RESTAURANT_REG_STEPS.STEP_3:
          return {
            mainText:
              "Welcome back, you've completed steps 1, 2 and 3 of your application, pickup where you left off!",
            subText: 'Estimated tme remaining is',
            strongText: '2-4 minutes',
            ctaText: 'Continue with your application',
            ctaTo: PATH_NEW_RESTAURANT.step_4
          };

        default:
          return {
            mainText:
              "It looks like you're new here, you'll need to submit a new restaurant application before you can start posting content/deals and tapping into the foodie userbase!",
            subText: 'The application process typically takes',
            strongText: '9-12 minutes',
            ctaText: 'Get started',
            ctaTo: PATH_NEW_RESTAURANT.step_1
          };
      }
    }
  }, [data?.data]);

  const { mainText, subText, strongText, ctaText, ctaTo } = getContent();

  const hasSubmit =
    data?.data?.status === RESTAURANT_STATUS.APPLICATION_PROCESSING ||
    data?.data?.status === RESTAURANT_STATUS.APPLICATION_REJECTED;

  return (
    <Box>
      <Container maxWidth={'lg'}>
        <Stack justifyContent={'center'} alignItems={'center'} mt={0}>
          {!hasSubmit && (
            <Box>
              <Image
                duration={200}
                width={isMobile ? '80vw' : 400}
                src={UndrawSVG}
                alt={'undraw'}
                wrapperStyle={{ marginBottom: 32 }}
              />
            </Box>
          )}

          <Typography textAlign={'center'} variant="h3" pb={2} component="h1">
            {user?.first_name ? `Hello ${user?.first_name},` : 'Hello,'}
          </Typography>
          <Typography
            textAlign={'center'}
            color={'text.secondary'}
            pb={2}
            variant={'body2'}
            maxWidth={!isMobile ? '80%' : '100%'}
          >
            {mainText}
          </Typography>

          <Typography
            textAlign={'center'}
            color={'text.secondary'}
            pb={2}
            variant={'body2'}
            maxWidth={!isMobile ? '80%' : '100%'}
          >
            {subText}{' '}
            <Box display={'inline'} fontWeight={'600'} color={'primary.main'}>
              {strongText}
            </Box>
          </Typography>
          <Spacer sp={1} />
          {hasSubmit && <RestaurantProfileIphone />}
          {!hasSubmit && (
            <Button
              sx={{
                width: 'max-content',
                alignSelf: 'center',
                bgcolor: 'text.primary',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
                //   '&:hover': {
                //     bgcolor: 'text.primary',
                //     color: (theme) =>
                //       theme.palette.mode === 'light' ? 'common.white' : 'grey.800'
                //   }
              }}
              variant="contained"
              color="primary"
              onClick={() => navigate(ctaTo)}
            >
              {ctaText}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

NewRestaurantGetStarted.propTypes = {};

export default NewRestaurantGetStarted;
