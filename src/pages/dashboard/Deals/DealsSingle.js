import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventBusyIcon from '@mui/icons-material/EventBusy';

import { DashboardStatGrid } from '../styles';
import StatCard from '../../../components/stat-card/StatCard';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';

import useSingleDealQuery from '../../../hooks/queries/useSingleDealQuery';

import { PATH_DASHBOARD } from '../../../routes/paths';

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
  backgroundColor: theme.palette.success.light,
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

// --------------------------------------------------------

const DealsSingle = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data, error, isLoading } = useSingleDealQuery(id);

  useEffect(() => {
    if (!id) {
      navigate(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deal = data?.data;

  if (isLoading) return <LoadingScreen />;

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
            maxWidth={'60%'}
            variant="body2"
            color={'text.secondary'}
          >
            {deal?.description}
          </Typography>
          <DateWrapper>
            <DateContainer>
              <StartDot />{' '}
              <Typography fontSize={'14px'}>
                {format(new Date(deal?.start_date), 'EEE do MMM yyyy')}
              </Typography>
            </DateContainer>
            <DateContainer>
              <EndDot />{' '}
              <Typography fontSize={'14px'}>
                {format(new Date(deal?.end_date), 'EEE do MMM yyyy')}
              </Typography>
            </DateContainer>
          </DateWrapper>
          <ActionsContainer>
            <LoadingButton
              variant="contained"
              endIcon={<DriveFileRenameOutlineOutlinedIcon />}
            >
              Edit
            </LoadingButton>
            <LoadingButton
              variant="contained"
              // color="secondary"
              endIcon={<EventBusyIcon />}
            >
              Expire
            </LoadingButton>
            <LoadingButton
              variant="contained"
              // color="error"
              endIcon={<DeleteOutlineIcon />}
            >
              Delete
            </LoadingButton>
          </ActionsContainer>
        </DealDetailsContainer>
        <DashboardStatGrid>
          <StatCard title={'Impressions'} value={1240} percentage={-1} />
          <StatCard title={'Views'} value={1240} percentage={1.2} />
          <StatCard title={'Saves'} value={540} percentage={0} />
        </DashboardStatGrid>
      </Container>
    </>
  );
};

DealsSingle.propTypes = {};

export default DealsSingle;
