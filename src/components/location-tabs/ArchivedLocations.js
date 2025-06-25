import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

import LocationCard from 'components/location-card/LocationCard';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import useLocationsQuery from 'hooks/queries/useLocationsQuery';

import { PATH_DASHBOARD } from 'routes/paths';
import { deleteLocation, unarchiveLocation } from 'lib/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';

import { LocationsWrapper } from './styles';
import LocationsEmpty from './LocationsEmpty';
import useTierLimits from 'hooks/useTierLimits';

const ArchivedLocations = () => {
  const [deleteLocationLoading, setDeleteLocationLoading] = useState(false);
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false);

  const [unarchiveLocationLoading, setUnarchiveLocationLoading] =
    useState(false);
  const [unarchiveLocationModalOpen, setUnarchiveLocationModalOpen] =
    useState(false);

  const locQuery = useLocationsQuery();
  const dashQuery = useDashboardOverviewQuery();

  const { enqueueSnackbar } = useSnackbar();

  const idToAction = useRef(null);

  const nav = useNavigate();

  const locations = useMemo(() => {
    return locQuery?.data?.data?.filter((l) => l.archived) || [];
  }, [locQuery?.data?.data]);

  const onEditLocationClick = (id) =>
    nav(`${PATH_DASHBOARD.locations_edit}/${id}`);

  const onCancelDeleteLocationModal = () => {
    setDeleteLocationModalOpen(false);
  };

  const onDeleteLocationClick = (_id) => {
    idToAction.current = _id;
    setDeleteLocationModalOpen(true);
  };

  const onUnarchiveLocationClick = (_id) => {
    idToAction.current = _id;
    setUnarchiveLocationModalOpen(true);
  };

  const onCancelUnarchiveLocationModal = () => {
    setUnarchiveLocationModalOpen(false);
  };

  const onConfirmLocationUnarchive = useCallback(async () => {
    try {
      setUnarchiveLocationLoading(true);
      const res = await unarchiveLocation(idToAction.current);
      const data = res?.data;
      locQuery.updateQuery(data);
      enqueueSnackbar('Location unarchived successfully');
      mixpanelTrack(MIXPANEL_EVENTS.unarchive_location_success);
    } catch (error) {
      enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
        variant: 'error'
      });

      mixpanelTrack(MIXPANEL_EVENTS.unarchive_location_failed, {
        error: error?.message
      });
    } finally {
      setUnarchiveLocationLoading(false);
      setUnarchiveLocationModalOpen(false);
    }
  }, [idToAction.current]);

  const onConfirmLocationDelete = useCallback(async () => {
    try {
      setDeleteLocationLoading(true);
      const res = await deleteLocation(idToAction.current);
      const data = res?.data;
      locQuery.updateQuery(data);
      enqueueSnackbar('Location deleted successfully');
      mixpanelTrack(MIXPANEL_EVENTS.delete_location_success);
      dashQuery.invalidateQuery();
    } catch (error) {
      enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
        variant: 'error'
      });

      mixpanelTrack(MIXPANEL_EVENTS.delete_location_failed, {
        error: error?.message
      });
    } finally {
      setDeleteLocationLoading(false);
      setDeleteLocationModalOpen(false);
    }
  }, [idToAction.current]);

  const limits = useTierLimits();

  const canAddLocation = limits.locations.current < limits.locations.limit;

  const modalText = useMemo(() => {
    if (idToAction.current) {
      const l = locations.find((lts) => lts._id === idToAction.current);
      if (deleteLocationModalOpen) {
        return `Are you sure you want to delete ${l?.nickname}, ${l?.address?.postcode}? All its statistics will also be deleted.`;
      }
      if (unarchiveLocationModalOpen) {
        return `Are you sure you want to unarchive ${l?.nickname}, ${l?.address?.postcode}?`;
      }
    }
    return '';
  }, [idToAction.current, unarchiveLocationModalOpen, deleteLocationModalOpen]);

  if (!locations?.length) {
    return <LocationsEmpty type={'archived'} />;
  }

  return (
    <>
      <Helmet>
        <title> Locations | Foodie</title>
      </Helmet>
      <LocationsWrapper>
        {locations?.length
          ? locations
              .map((location) => {
                return (
                  <LocationCard
                    {...location}
                    canAddLocation={canAddLocation}
                    withArchive
                    key={location._id}
                    onEdit={onEditLocationClick}
                    onDelete={onDeleteLocationClick}
                    onUnarchive={onUnarchiveLocationClick}
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
          subtitle={modalText}
          isOpen={deleteLocationModalOpen}
          submitLoading={deleteLocationLoading}
          onCancel={onCancelDeleteLocationModal}
          onAccept={onConfirmLocationDelete}
        />
      )}
      {unarchiveLocationModalOpen && (
        <AcceptDeclineModal
          destructive
          title={'Unarchive Location'}
          subtitle={modalText}
          isOpen={unarchiveLocationModalOpen}
          submitLoading={unarchiveLocationLoading}
          onCancel={onCancelUnarchiveLocationModal}
          onAccept={onConfirmLocationUnarchive}
        />
      )}
    </>
  );
};

ArchivedLocations.propTypes = {};

export default ArchivedLocations;
