import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

import LocationCard from 'components/location-card/LocationCard';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import useLocationsQuery from 'hooks/queries/useLocationsQuery';

import { PATH_DASHBOARD } from 'routes/paths';
import { archiveLocation, deleteLocation } from 'lib/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';

import { LocationsWrapper } from './styles';
import LocationsEmpty from './LocationsEmpty';
import { invalidateSingleDeal } from 'hooks/queries/useSingleDealQuery';

const ActiveLocations = () => {
  const [deleteLocationLoading, setDeleteLocationLoading] = useState(false);
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false);

  const [archiveLocationLoading, setArchiveLocationLoading] = useState(false);
  const [archiveLocationModalOpen, setArchiveLocationModalOpen] =
    useState(false);

  const locQuery = useLocationsQuery();
  const dashQuery = useDashboardOverviewQuery();

  const { enqueueSnackbar } = useSnackbar();

  const idToAction = useRef(null);

  const nav = useNavigate();

  console.log(locQuery.data);

  const locations = useMemo(() => {
    return locQuery?.data?.locations?.filter((l) => !l.archived) || [];
  }, [locQuery?.data]);

  const onEditLocationClick = (id) =>
    nav(`${PATH_DASHBOARD.locations_edit}/${id}`);

  const onCancelDeleteLocationModal = () => {
    setDeleteLocationModalOpen(false);
  };

  const onDeleteLocationClick = (_id) => {
    idToAction.current = _id;
    setDeleteLocationModalOpen(true);
  };

  const onArchiveLocationClick = (_id) => {
    idToAction.current = _id;
    setArchiveLocationModalOpen(true);
  };

  const onCancelArchiveLocationModal = () => {
    setArchiveLocationModalOpen(false);
  };

  const onConfirmLocationArchive = useCallback(async () => {
    try {
      setArchiveLocationLoading(true);
      const res = await archiveLocation(idToAction.current);
      locQuery.updateQuery(res);
      invalidateSingleDeal();
      enqueueSnackbar('Location archived successfully');
      mixpanelTrack(MIXPANEL_EVENTS.archive_location_success);
    } catch (error) {
      enqueueSnackbar(`${error?.message || 'Unexpected error occured'}`, {
        variant: 'error'
      });
      mixpanelTrack(MIXPANEL_EVENTS.archive_location_failed, {
        error: error?.message
      });
    } finally {
      setArchiveLocationLoading(false);
      setArchiveLocationModalOpen(false);
    }
  }, [idToAction.current]);

  const onConfirmLocationDelete = useCallback(async () => {
    try {
      setDeleteLocationLoading(true);
      const res = await deleteLocation(idToAction.current);
      locQuery.updateQuery(res);
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

  const modalText = useMemo(() => {
    if (idToAction.current) {
      const l = locations.find((lts) => lts._id === idToAction.current);
      if (deleteLocationModalOpen) {
        return `Are you sure you want to delete ${l?.nickname}, ${l?.address?.postcode}? All its statistics will also be deleted.`;
      }
      if (archiveLocationModalOpen) {
        return `Are you sure you want to archive ${l?.nickname}, ${l?.address?.postcode}?`;
      }
    }
    return '';
  }, [idToAction.current, archiveLocationModalOpen, deleteLocationModalOpen]);

  if (!locations?.length) {
    return <LocationsEmpty type={'active'} />;
  }

  return (
    <>
      <Helmet>
        <title> Locations | Foodie</title>
      </Helmet>
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
                    onArchive={onArchiveLocationClick}
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
      {archiveLocationModalOpen && (
        <AcceptDeclineModal
          destructive
          title={'Archive Location'}
          subtitle={modalText}
          isOpen={archiveLocationModalOpen}
          submitLoading={archiveLocationLoading}
          onCancel={onCancelArchiveLocationModal}
          onAccept={onConfirmLocationArchive}
        />
      )}
    </>
  );
};

ActiveLocations.propTypes = {};

export default ActiveLocations;
