import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, styled } from '@mui/material';

import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { DashboardStatGrid } from '../styles';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import StatCardAvg from '../../../components/stat-card/StatCardAvg';
import AcceptDeclineModal from '../../../components/accept-decline-modal/AcceptDeclineModal';
import Subheader from '../../../components/subheader/Subheader';
import LightLoadingButton from '../../../components/light-loading-button/LightLoadingButton';

import { PATH_DASHBOARD } from '../../../routes/paths';
import { expireDeal } from '../../../utils/api';
import useSingleDealQuery from '../../../hooks/queries/useSingleDealQuery';
import useActiveDealsQuery from '../../../hooks/queries/useActiveDealsQuery';
import useCustomMediaQueries from '../../../hooks/useCustomMediaQueries';

const DealDetailsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
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
  marginTop: theme.spacing(2)
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
  marginTop: theme.spacing(4)
}));

// --------------------------------------------------------

const DealsSingle = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useSingleDealQuery(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { isTablet } = useCustomMediaQueries();

  const [expireDealModal, setExpireDealModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onExpireCancel = () => setExpireDealModal(false);
  const onExpireOpen = () => setExpireDealModal(true);

  const activeDeals = useActiveDealsQuery();
  const expiredDeals = useActiveDealsQuery();

  const handleOnExpireSubmit = async () => {
    if (deal?._id) {
      setSubmitLoading(true);
      try {
        const res = await expireDeal(deal?._id);
        refetch();
        await activeDeals.refetch();
        await expiredDeals.refetch();
        enqueueSnackbar(`Successfully expired ${deal?.name}`, {
          variant: 'success'
        });
        setExpireDealModal(false);
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        setExpireDealModal(false);
        enqueueSnackbar(`Unable to expire ${deal?.name} please try again`, {
          variant: 'error'
        });
      }
    }
  };

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

  const deal = data?.data;

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
          <ActionsContainer>
            {isExpired && (
              <LightLoadingButton
                variant="text"
                endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              >
                Use as template
              </LightLoadingButton>
            )}
            {!isExpired && (
              <LightLoadingButton
                variant="text"
                endIcon={<DriveFileRenameOutlineOutlinedIcon />}
              >
                Edit
              </LightLoadingButton>
            )}
            {!isExpired && (
              <LightLoadingButton
                variant="text"
                onClick={onExpireOpen}
                endIcon={<EventBusyIcon />}
              >
                Expire
              </LightLoadingButton>
            )}
            <LightLoadingButton variant="text" endIcon={<DeleteOutlineIcon />}>
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
            avg_per_day={deal?.impressions?.avg}
            title={'Impressions'}
            value={deal?.impressions?.count}
          />
          <StatCardAvg
            avg_per_day={deal?.view_count?.avg}
            title={'Views'}
            value={deal?.view_count?.count}
          />
          <StatCardAvg
            title={'Saves'}
            avg_per_day={deal?.save_count?.avg}
            value={deal?.save_count?.count}
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
