import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { format, isAfter } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  MenuItem,
  Typography,
  styled
} from '@mui/material';

import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventBusyIcon from '@mui/icons-material/EventBusy';

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import { DashboardStatGrid } from '../styles';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import StatCardAvg from 'components/stat-card/StatCardAvg';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';

import { PATH_DASHBOARD } from 'routes/paths';
import { deleteDeal, expireDeal } from 'lib/api';
import useSingleDealQuery from 'hooks/queries/useSingleDealQuery';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'lib/mixpanel';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';
import Subheader from 'components/subheader/Subheader';
import Breadcrumbs from 'components/breadcrumbs';
import Label from 'components/label';

import MenuPopover from 'components/menu-popover';

const StartDot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  height: '8px',
  width: '8px',
  borderRadius: '100%'
}));

const EndDot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  height: '8px',
  width: '8px',
  borderRadius: '100%'
}));

const DateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const DateWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(2)
}));

const TitleStatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginBottom: theme.spacing(1)
}));

const LocationChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap'
}));

const DealWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2)
}));

const LocationChipList = React.memo(({ locations }) => {
  return (
    <LocationChipsContainer>
      {locations?.map((lo) => {
        return (
          <Chip
            size="small"
            key={lo.nickname}
            variant="filled"
            label={lo.nickname}
          />
        );
      })}
    </LocationChipsContainer>
  );
});

const breadcrumbs = [{ name: 'Deals', link: '/dashboard/deals' }];

// --------------------------------------------------------

const DealsSingle = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useSingleDealQuery(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const { isTablet } = useCustomMediaQueries();

  const [submitLoading, setSubmitLoading] = useState(false);

  const [expireDealModal, setExpireDealModal] = useState(false);
  const onExpireCancel = () => setExpireDealModal(false);
  const onExpireOpen = () => setExpireDealModal(true);

  const [deleteDealModal, setDeleteDealModal] = useState(false);
  const onDeleteCancel = () => setDeleteDealModal(false);
  const onDeleteOpen = () => setDeleteDealModal(true);

  const onUseAsTemplate = () =>
    navigate(`${PATH_DASHBOARD.deals_create}/?template_id=${id}`);

  const onEdit = () => navigate(`${PATH_DASHBOARD.deals_edit}/${id}`);

  const activeDeals = useActiveDealsQuery();
  const expiredDeals = useExpiredDealsQuery();
  const dash = useDashboardOverviewQuery();

  const deal = data?.data;

  const handleOnExpireSubmit = useCallback(async () => {
    if (deal?._id) {
      setSubmitLoading(true);
      try {
        await expireDeal(deal?._id);
        await Promise.all([
          refetch(),
          activeDeals.refetch(),
          expiredDeals.refetch(),
          dash.invalidateQuery()
        ]);
        mixpanelTrack(MIXPANEL_EVENTS.expire_deal_success);
        enqueueSnackbar(`Successfully expired ${deal?.name}`, {
          variant: 'success'
        });
        setExpireDealModal(false);
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        setExpireDealModal(false);
        mixpanelTrack(MIXPANEL_EVENTS.expire_deal_error);
        enqueueSnackbar(`Unable to expire ${deal?.name} please try again`, {
          variant: 'error'
        });
      } finally {
        setOpenPopover(false);
      }
    }
  }, [deal?._id, deal?.name]);

  const handleOnDeleteSubmit = useCallback(async () => {
    if (deal?._id) {
      setSubmitLoading(true);
      try {
        await deleteDeal(deal?._id);

        await Promise.all([
          activeDeals.refetch(),
          expiredDeals.refetch(),
          dash.invalidateQuery()
        ]);

        enqueueSnackbar(`Successfully deleted ${deal?.name}`, {
          variant: 'success'
        });
        mixpanelTrack(MIXPANEL_EVENTS.delete_deal_success);
        setExpireDealModal(false);
        setSubmitLoading(false);
        navigate(PATH_DASHBOARD.root, { replace: true });
      } catch (error) {
        setSubmitLoading(false);
        setExpireDealModal(false);
        mixpanelTrack(MIXPANEL_EVENTS.delete_deal_error);
        enqueueSnackbar(`Unable to delete ${deal?.name} please try again`, {
          variant: 'error'
        });
      }
    }
  }, [deal?._id, deal?.name]);

  useEffect(() => {
    if (!id) {
      navigate(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error?.message || 'Unexpected error occured', {
        variant: 'error'
      });
      navigate(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const startsLater = useMemo(
    () => isAfter(new Date(), new Date(deal?.start_date || null)),
    [deal?.start_date]
  );

  if (isLoading) return <LoadingScreen />;

  if (!deal) return null;

  const isExpired = deal?.is_expired;

  const needsAttention = !isExpired && deal.locations.length === 0;

  return (
    <>
      <Helmet>
        <title> {deal?.name ? `${deal?.name} | Deal` : 'Foodie'}</title>
      </Helmet>
      <Container sx={{ px: 3, pb: 6 }} maxWidth={'xl'}>
        <Breadcrumbs mb={3} current={deal?.name} trail={breadcrumbs} />
        <DealWrapper mb={4}>
          <TitleStatusContainer>
            <Typography variant="h3">{deal?.name}</Typography>
            <Label
              sx={{ fontSize: 14 }}
              color={
                needsAttention ? 'warning' : isExpired ? 'error' : 'success'
              }
              mt={0.5}
            >
              {needsAttention ? 'Issue' : isExpired ? 'Expired' : 'Live'}
            </Label>
            <IconButton
              onClick={handleOpenPopover}
              sx={{ ml: -1, mt: 0.5 }}
              size="small"
            >
              <MoreHorizOutlinedIcon />
            </IconButton>
            <MenuPopover
              open={openPopover}
              onClose={() => setOpenPopover(false)}
              sx={{ width: 200, p: 0 }}
            >
              {isExpired && (
                <MenuItem onClick={onUseAsTemplate}>
                  <DriveFileRenameOutlineOutlinedIcon /> Use as template
                </MenuItem>
              )}
              {!isExpired && (
                <MenuItem onClick={onEdit}>
                  <DriveFileRenameOutlineOutlinedIcon />
                  Edit
                </MenuItem>
              )}
              {!isExpired && startsLater && (
                <MenuItem onClick={onExpireOpen}>
                  <EventBusyIcon /> Expire
                </MenuItem>
              )}
              <MenuItem onClick={onDeleteOpen}>
                <DeleteOutlineIcon /> Delete
              </MenuItem>
            </MenuPopover>
          </TitleStatusContainer>

          <Typography
            mb={4}
            maxWidth={isTablet ? '90%' : '60%'}
            variant="body2"
            color={'text.secondary'}
          >
            {deal?.description}
          </Typography>

          <DateWrapper>
            <div>
              <Subheader mb={1.5} text={'Start date'} />
              <DateContainer>
                <StartDot />{' '}
                <Typography fontSize={'16px'}>
                  {format(
                    new Date(deal?.start_date || null),
                    'EEE do MMM yyyy'
                  )}
                </Typography>
              </DateContainer>
            </div>
            <div>
              <Subheader mb={1.5} text={'End date'} />
              <DateContainer>
                <EndDot />{' '}
                <Typography fontSize={'16px'}>
                  {deal?.end_date
                    ? format(
                        new Date(deal?.end_date || null),
                        'EEE do MMM yyyy'
                      )
                    : 'N/A'}
                </Typography>
              </DateContainer>
            </div>
          </DateWrapper>
          <Box>
            <Subheader mt={4} mb={1.5} text={'Locations'} />
            {needsAttention ? (
              <Alert sx={{ width: 'max-content' }} severity="warning">
                <AlertTitle>Needs Attention</AlertTitle>
                This deal doesn't have any locations assigned, so it's currently
                not visible in the customer app.
                <br />
                Please add at least one location to make it live again.
                <br />
                <Button onClick={onEdit} sx={{ mt: 1 }} variant="contained">
                  Edit Location
                </Button>
              </Alert>
            ) : (
              <LocationChipList locations={deal?.locations} />
            )}
          </Box>

          {/* <ActionsContainer>
            {isExpired && (
              <LightLoadingButton
                onClick={onUseAsTemplate}
                variant="text"
                endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              >
                Use as template
              </LightLoadingButton>
            )}
            {!isExpired && (
              <LightLoadingButton
                variant="text"
                onClick={onEdit}
                endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              >
                Edit
              </LightLoadingButton>
            )}
            {!isExpired && startsLater && (
              <LightLoadingButton
                variant="text"
                onClick={onExpireOpen}
                endIcon={<EventBusyIcon />}
              >
                Expire
              </LightLoadingButton>
            )}
            <LightLoadingButton
              onClick={onDeleteOpen}
              variant="text"
              endIcon={<DeleteOutlineIcon />}
            >
              Delete
            </LightLoadingButton>
          </ActionsContainer> */}
        </DealWrapper>
        <Subheader text={'Insights'} />
        <DashboardStatGrid>
          <StatCardAvg
            avg_per_day={deal?.averages?.views || 0}
            title={'Views'}
            value={deal?.counts?.views || 0}
          />
          <StatCardAvg
            title={'Favourites'}
            avg_per_day={deal?.averages?.favourites || 0}
            value={deal?.counts?.favourites || 0}
          />
        </DashboardStatGrid>
      </Container>
      {expireDealModal && (
        <ExpireDealModal
          dealName={deal?.name}
          onCancel={onExpireCancel}
          isOpen={expireDealModal}
          onAccept={handleOnExpireSubmit}
          submitLoading={submitLoading}
        />
      )}
      {deleteDealModal && (
        <DeleteDealModal
          dealName={deal?.name}
          onCancel={onDeleteCancel}
          isOpen={deleteDealModal}
          onAccept={handleOnDeleteSubmit}
          submitLoading={submitLoading}
        />
      )}
    </>
  );
};

DealsSingle.propTypes = {};

export default DealsSingle;

const ExpireDealModal = ({
  onCancel,
  onAccept,
  submitLoading,
  isOpen,
  dealName
}) => {
  return (
    <AcceptDeclineModal
      onCancel={onCancel}
      onAccept={onAccept}
      acceptText={'Yes, expire'}
      cancelText={'Cancel'}
      destructive
      submitLoading={submitLoading}
      title={`Expire ${dealName}`}
      subtitle={
        'Are you sure you want to expire this deal? Once expired the deal will no longer appear on users feed and will move over to your expired deals.'
      }
      isOpen={isOpen}
    />
  );
};

const DeleteDealModal = ({
  onCancel,
  onAccept,
  submitLoading,
  isOpen,
  dealName
}) => {
  return (
    <AcceptDeclineModal
      onCancel={onCancel}
      onAccept={onAccept}
      acceptText={'Yes, delete'}
      cancelText={'Cancel'}
      destructive
      submitLoading={submitLoading}
      title={`Delete ${dealName}`}
      subtitle={
        'Are you sure you want to delete this deal? This deal and its stats will be deleted forever.'
      }
      isOpen={isOpen}
    />
  );
};
