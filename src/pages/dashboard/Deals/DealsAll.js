import React from 'react';

import { Helmet } from 'react-helmet-async';
import { Alert, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import DealTableTabs from 'components/deal-tables/DealTableTabs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';
import { PATH_DASHBOARD } from 'routes/paths';
import useTierLimits from 'hooks/useTierLimits';

const alertSx = { maxWidth: 500, mt: 2 };

const DealsAll = () => {
  const resQuery = useRestaurantQuery();

  const limits = useTierLimits();
  const canAddDeal = limits.deals.current < limits.deals.limit;

  const isSubscribed = resQuery.data?.data?.is_subscribed;

  const disableButton = !canAddDeal || !isSubscribed;

  const nav = useNavigate();

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  const onCreateDeal = () => nav(PATH_DASHBOARD.deals_create);

  if (restLoading || limits.isLoading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title> All deals | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3 }} maxWidth={'xl'}>
        <DashboardTitleContainer key={'deals-all'}>
          <DashboardTitle title="Deals" />

          <Typography mb={2} variant="body2" color={'text.secondary'}>
            You can view and manage {restaurant.name}'s Deals here.
          </Typography>

          <LightLoadingButton
            variant={disableButton ? 'contained' : undefined}
            disabled={disableButton}
            onClick={onCreateDeal}
            endIcon={<DriveFileRenameOutlineOutlinedIcon />}
          >
            Create a new deal
          </LightLoadingButton>
          {!!isSubscribed && !canAddDeal && (
            <Alert sx={alertSx} severity="warning">
              You've hit the limit of Active Deals you can create for your
              Subscription Tier.
              <strong>
                {limits.deals.limit === 3 ? ' (3)' : ' (5 x Locations)'}
              </strong>
            </Alert>
          )}
        </DashboardTitleContainer>
        <Box>
          <DealTableTabs />
        </Box>
      </Container>
    </>
  );
};

export default DealsAll;
