import React, { useMemo } from 'react';
import Image from 'mui-image';
import { useNavigate } from 'react-router';

import { Container } from '@mui/system';
import { Box, Button, Stack, Typography } from '@mui/material';

import Spacer from 'components/spacer/Spacer';

import UndrawSVG from 'assets/undraw-content-team-8.svg';

import { PATH_NEW_RESTAURANT } from 'routes/paths';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import { useAuthContext } from 'hooks/useAuthContext';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import RestaurantProfileIphone from 'components/iphone/RestaurantProfileIphone';
import Permissions from 'utils/permissions';

const NewRestaurantGetStarted = (props) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isMobile } = useCustomMediaQueries();
  const { data } = useRestaurantQuery();

  // eslint-disable-next-line consistent-return
  const content = useMemo(() => {
    const regStep = data?.data?.registration_step;
    const status = data?.data?.status;

    if (Permissions.isApplicationRejected(status)) {
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
    if (Permissions.isApplicationProcessing(status)) {
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
      if (Permissions.isStep1Complete(regStep)) {
        return {
          mainText:
            "Welcome back, you've completed the first step of your application, pickup where you left off!",
          subText: 'Estimated tme remaining is',
          strongText: '8-10 minutes',
          ctaText: 'Continue with your application',
          ctaTo: PATH_NEW_RESTAURANT.step_2
        };
      }

      if (Permissions.isStep2Complete(regStep)) {
        return {
          mainText:
            "Welcome back, you've completed the first two steps of your application, pickup where you left off!",
          subText: 'Estimated tme remaining is',
          strongText: '4-8 minutes',
          ctaText: 'Continue with your application',
          ctaTo: PATH_NEW_RESTAURANT.step_3
        };
      }

      if (Permissions.isStep3Complete(regStep)) {
        return {
          mainText:
            "Welcome back, you've completed steps 1, 2 and 3 of your application, pickup where you left off!",
          subText: 'Estimated tme remaining is',
          strongText: '2-4 minutes',
          ctaText: 'Continue with your application',
          ctaTo: PATH_NEW_RESTAURANT.step_4
        };
      }

      return {
        mainText:
          "It looks like you're new here, you'll need to submit a new restaurant application before you can start posting content/deals and tapping into the foodie userbase!",
        subText: 'The application process typically takes',
        strongText: '9-12 minutes',
        ctaText: 'Get started',
        ctaTo: PATH_NEW_RESTAURANT.step_1
      };
    }
  }, [data?.data]);

  const { mainText, subText, strongText, ctaText, ctaTo } = content;

  const hasSubmit =
    Permissions.isApplicationProcessing(data?.data?.status || 0) ||
    Permissions.isApplicationProcessing(data?.data?.status || 0);

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
