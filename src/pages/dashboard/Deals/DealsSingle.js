import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { format, isAfter } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Box, Chip, Container, Typography, styled } from '@mui/material';

import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { DashboardStatGrid } from '../styles';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import StatCardAvg from 'components/stat-card/StatCardAvg';
import AcceptDeclineModal from 'components/accept-decline-modal/AcceptDeclineModal';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';

import { PATH_DASHBOARD } from 'routes/paths';
import { deleteDeal, expireDeal } from 'utils/api';
import useSingleDealQuery from 'hooks/queries/useSingleDealQuery';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';

const DealDetailsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

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
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(8),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(3)
  }
}));

const ExpiredStatusContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isExpired'
})(({ theme, isExpired }) => ({
  display: 'flex',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(0),
  backgroundColor: isExpired
    ? theme.palette.error.main
    : theme.palette.success.main,
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff'
}));

const InsightsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(3)
}));

const LocationChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap'
}));

const LocationChipList = React.memo(({ locations }) => {
  return (
    <LocationChipsContainer>
      {locations?.map((lo) => {
        return (
          <Chip key={lo.nickname} variant="outlined" label={lo.nickname} />
        );
      })}
    </LocationChipsContainer>
  );
});

// --------------------------------------------------------

const DealsSingle = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch, remove } = useSingleDealQuery(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
        const res = await expireDeal(deal?._id);
        refetch();
        activeDeals.remove();
        expiredDeals.remove();
        dash.remove();
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
      }
    }
  }, [deal?._id, deal?.name]);

  const handleOnDeleteSubmit = useCallback(async () => {
    if (deal?._id) {
      setSubmitLoading(true);
      try {
        const res = await deleteDeal(deal?._id);
        remove();
        activeDeals.remove();
        expiredDeals.remove();
        dash.remove();

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

  const isExpired = deal?.is_expired;

  if (isLoading) return <LoadingScreen />;

  if (!deal) return null;

  return (
    <>
      <Helmet>
        <title> {deal?.name ? `${deal?.name} | Deal` : 'Foodie'}</title>
      </Helmet>
      <Container sx={{ px: 3, pb: 6 }} maxWidth={'xl'}>
        <DealDetailsContainer>
          <Typography textAlign={'center'} variant="h1">
            {deal?.name}
          </Typography>
          <Typography
            mb={2}
            textAlign={'center'}
            maxWidth={isTablet ? '90%' : '60%'}
            variant="body2"
            color={'text.secondary'}
          >
            {deal?.description}
          </Typography>
          <ExpiredStatusContainer isExpired={isExpired}>
            {isExpired ? 'Expired' : 'Active'}
          </ExpiredStatusContainer>
          <DateWrapper>
            <DateContainer>
              <StartDot />{' '}
              <Typography fontSize={'16px'}>
                {format(new Date(deal?.start_date || null), 'EEE do MMM yyyy')}
              </Typography>
            </DateContainer>
            <DateContainer>
              <EndDot />{' '}
              <Typography fontSize={'16px'}>
                {format(new Date(deal?.end_date || null), 'EEE do MMM yyyy')}
              </Typography>
            </DateContainer>
          </DateWrapper>
          <LocationChipList locations={deal?.locations} />
          <ActionsContainer>
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
          </ActionsContainer>
        </DealDetailsContainer>
        <InsightsContainer>
          <QueryStatsIcon color={'primary'} />
          <Typography
            fontSize={'22px!important'}
            textAlign={'center'}
            variant="h4"
          >
            Insights
          </Typography>
        </InsightsContainer>
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
      submitLoading={submitLoading}
      title={'Expire this deal'}
      subtitle={'Are you sure you want to expire this deal?'}
      isOpen={isOpen}
    >
      <Box mt={2}>
        <Box mb={2}>
          <Typography mb={1} fontSize={18} fontWeight={700}>
            {dealName}
          </Typography>
          <Typography color={'text.secondary'} variant="body2">
            Once expired the deal will no longer appear on users feed and will
            move over to your expired deals.
          </Typography>
        </Box>
      </Box>
    </AcceptDeclineModal>
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
      submitLoading={submitLoading}
      title={'Delete this deal'}
      subtitle={'Are you sure you want to delete this deal?'}
      isOpen={isOpen}
    >
      <Box mt={2}>
        <Box mb={2}>
          <Typography mb={1} fontSize={18} fontWeight={700}>
            {dealName}
          </Typography>
          <Typography color={'text.secondary'} variant="body2">
            This deal and its stats will be deleted forever.
          </Typography>
        </Box>
      </Box>
    </AcceptDeclineModal>
  );
};
