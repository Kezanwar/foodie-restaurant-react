import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { Alert, Box, Container, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { DashboardTitleContainer } from '../styles';
import DashboardTitle from 'components/dashboard-title/DashboardTitle';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';
import LocationCard from 'components/location-card/LocationCard';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import useLocationsQuery from 'hooks/queries/useLocationsQuery';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import { PATH_DASHBOARD } from 'routes/paths';
import { deleteLocation } from 'utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';
import { useAuthContext } from 'hooks/useAuthContext';
import Permissions from 'utils/permissions';
import useTierLimits from 'hooks/useTierLimits';

export const LocationsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6)
}));

const alertSx = { maxWidth: 500, mt: 2 };

const LocationsAll = () => {
  const [deleteLocationLoading, setDeleteLocationLoading] = useState(false);
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false);

  const resQuery = useRestaurantQuery();
  const locQuery = useLocationsQuery();
  const dashQuery = useDashboardOverviewQuery();

  const limits = useTierLimits();

  const canAddLocation = limits.locations.current < limits.locations.limit;

  const isSubscribed = resQuery.data?.data?.is_subscribed;

  const disableButton = !canAddLocation || !isSubscribed;

  const { enqueueSnackbar } = useSnackbar();

  const idToDelete = useRef(null);

  const nav = useNavigate();

  const locations = locQuery?.data?.data;

  const restaurant = resQuery?.data?.data;

  const restLoading = resQuery?.isLoading;

  const onAddLocationClick = () => nav(PATH_DASHBOARD.locations_add);

  const onEditLocationClick = (id) =>
    nav(`${PATH_DASHBOARD.locations_edit}/${id}`);

  const onCancelDeleteLocationModal = () => {
    setDeleteLocationModalOpen(false);
  };

  const onDeleteLocationClick = (_id) => {
    idToDelete.current = _id;
    setDeleteLocationModalOpen(true);
  };

  const onConfirmLocationDelete = useCallback(async () => {
    try {
      setDeleteLocationLoading(true);
      const res = await deleteLocation(idToDelete.current);
      const data = res?.data;
      locQuery.updateQuery(data);
      enqueueSnackbar('Location deleted successfully');
      mixpanelTrack(MIXPANEL_EVENTS.delete_location_success);
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
      dashQuery.remove();
    } catch (error) {
      enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
        variant: 'error'
      });
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
      mixpanelTrack(MIXPANEL_EVENTS.delete_location_failed, {
        error: error?.message
      });
    }
  }, []);

  const deleteModalText = useMemo(() => {
    if (idToDelete.current) {
      const l = locations.find((lts) => lts._id === idToDelete.current);
      return `Are you sure you want to delete ${l?.nickname}, ${l?.address?.postcode}?`;
    }
    return '';
  }, [idToDelete.current]);

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
              You've hit the max number of Locations for your Subscription Tier.
            </Alert>
          )}
        </DashboardTitleContainer>
        <LocationsWrapper>
          {locations?.length
            ? locations
                .map((location, index) => {
                  return (
                    <LocationCard
                      {...location}
                      key={location._id}
                      onEdit={onEditLocationClick}
                      onDelete={onDeleteLocationClick}
                    />
                  );
                })
                .reverse()
            : null}
        </LocationsWrapper>
        {deleteLocationModalOpen && (
          <AcceptDeclineModal
            destructive
            title={'Delete Location'}
            subtitle={deleteModalText}
            isOpen={deleteLocationModalOpen}
            submitLoading={deleteLocationLoading}
            onCancel={onCancelDeleteLocationModal}
            onAccept={onConfirmLocationDelete}
          />
        )}
      </Container>
    </>
  );
};

LocationsAll.propTypes = {};

export default LocationsAll;
