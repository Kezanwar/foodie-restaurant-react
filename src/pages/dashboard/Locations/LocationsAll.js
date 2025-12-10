import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Alert, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';

import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import { PATH_DASHBOARD } from 'routes/paths';

import useTierLimits from 'hooks/useTierLimits';
import LocationTabs from 'components/location-tabs/LocationTabs';

const alertSx = { maxWidth: 500, mt: 2 };

const LocationsAll = () => {
  const resQuery = useRestaurantQuery();
  const locQuery = useLocationsQuery();

  const limits = useTierLimits();

  const canAddLocation = limits.locations.current < limits.locations.limit;

  const restaurant = resQuery?.data?.restaurant;

  const isSubscribed = restaurant?.is_subscribed;

  const disableButton = !canAddLocation || !isSubscribed;

  const nav = useNavigate();

  const restLoading = resQuery?.isLoading;

  const onAddLocationClick = () => nav(PATH_DASHBOARD.locations_add);

  if (restLoading || limits.isLoading || locQuery.isLoading)
    return <LoadingScreen />;
  return (
    <>
      <Helmet>
        <title> Locations | Foodie</title>
      </Helmet>

      <Container sx={{ px: 3, pb: 4 }} maxWidth={'xl'}>
        <DashboardTitleContainer>
          <DashboardTitle title="Locations" />
          <Typography mb={2} variant="body2" color={'text.secondary'}>
            You can view and manage {restaurant.name}'s Locations here.
          </Typography>
          <LightLoadingButton
            variant={disableButton ? 'contained' : undefined}
            disabled={disableButton}
            onClick={onAddLocationClick}
            endIcon={<DriveFileRenameOutlineOutlinedIcon />}
          >
            Add a new location
          </LightLoadingButton>
          {!!isSubscribed && !canAddLocation && (
            <Alert sx={alertSx} severity="info">
              You've hit the max number of <strong>Active Locations</strong> for
              your Subscription Tier.
            </Alert>
          )}
        </DashboardTitleContainer>
        <LocationTabs />
      </Container>
    </>
  );
};

LocationsAll.propTypes = {};

export default LocationsAll;
