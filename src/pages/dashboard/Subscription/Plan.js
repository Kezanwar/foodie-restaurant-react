import React, { useEffect, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import PlanLabel, { StyledLabel } from 'components/plan-label';
import Subheader from 'components/subheader/Subheader';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import Permissions from 'lib/permissions';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import useSubscriptionQuery from 'hooks/queries/useSubscriptionQuery';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { PlanLoading } from './styles';
import useTierLimits from 'hooks/useTierLimits';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';
import { cancelPlan } from 'lib/api';
import useAuthStore from 'stores/auth';
import LightChip from 'components/light-chip';
import { Navigate } from 'react-router';

const PlanWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '900px',
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2)
}));

const PlanInnerContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: '12px',
  gap: theme.spacing(12),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(4)
  }
}));

const FreeTrialInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.info.main,
  fontSize: 12,
  fontWeight: 500
}));

const TitleWithChipBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const InvoiceCaption = ({ title, text }) => {
  return (
    <Box>
      <Typography
        mr={0.5}
        fontSize={12}
        component={'span'}
        color={'text.secondary'}
      >
        {title}
      </Typography>
      <Typography fontWeight={600} mt={0.5} variant={'body1'}>
        {text}
      </Typography>
    </Box>
  );
};

const plan_details = {
  individual: {
    price: 66,
    caption:
      'Perfect for start-ups and small restaurants with a single location.',
    location_limit: 1,
    deal_limit: 5
  },
  premium: {
    price: 120,
    caption: 'Suitable for growing businesses with up to 3 locations.',
    location_limit: 3,
    deal_limit: 15
  },
  enterprise: {
    price: 'Contact Sales',
    caption: 'Tailored for large enterprises with unlimited locations.'
  }
};

const Plan = () => {
  const [showCancelSubModal, setShowCancelSubModal] = useState(false);
  const [cancelSubLoading, setCancelSubLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const query = useRestaurantQuery();

  const rest = query?.data?.restaurant;

  const plan = Permissions.getTier(rest?.tier);

  const subQuery = useSubscriptionQuery();

  const limits = useTierLimits();

  const sub = subQuery?.data?.data;

  const trialLeft =
    sub?.trial_end && sub.trial_end > sub.current_period.start
      ? differenceInDays(sub.trial_end, Date.now()) + 1
      : null;

  const { isMobile } = useCustomMediaQueries();

  const handleOnCancelSubSubmit = async () => {
    try {
      setCancelSubLoading(true);
      await cancelPlan();
      const { initialize } = useAuthStore.getState();
      await initialize(); //refetch user/current sub
    } catch (error) {
      console.error(error);
    } finally {
      setCancelSubLoading(false);
      setShowCancelSubModal(false);
    }
  };

  if (subQuery.isError) {
    return <Navigate to={'/dashboard/overview'} />;
  }

  return (
    <>
      <Helmet>
        <title> Plan | Foodie</title>
      </Helmet>
      {subQuery.isLoading ? (
        <PlanLoading />
      ) : (
        <PlanWrapper>
          <PlanInnerContainer>
            <Box>
              <Box pb={4}>
                <TitleWithChipBox>
                  <Subheader mb={0} color={'text.secondary'} text={'tier'} />
                  <PlanLabel plan={plan} />
                </TitleWithChipBox>

                <Typography
                  variant="caption"
                  display={'block'}
                  mt={1.5}
                  maxWidth={!isMobile ? '80%' : '100%'}
                  color={'text.secondary'}
                >
                  {plan_details[plan].caption}
                </Typography>
              </Box>

              <Box pb={4}>
                <Subheader color={'text.secondary'} mb={1} text={'price'} />
                <Stack spacing={1} direction="row" alignItems={'center'}>
                  <Typography variant="h5">£</Typography>
                  <Typography fontWeight={600} variant={'h4'}>
                    {plan_details[plan].price}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ alignSelf: 'center', color: 'text.secondary' }}
                  >
                    /mo{' '}
                    <Typography component={'span'} variant="caption">
                      incl VAT
                    </Typography>
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <TitleWithChipBox>
                  <Subheader
                    color={'text.secondary'}
                    mb={0}
                    text={'Last Invoice'}
                  />
                  <StyledLabel
                    color={sub.latest_invoice.paid ? 'success' : 'error'}
                  >
                    {sub.latest_invoice.paid ? 'Paid' : 'Not Paid'}
                  </StyledLabel>
                </TitleWithChipBox>

                <Stack spacing={1} mt={1}>
                  <Box display={'flex'} gap={4} pb={1}>
                    <InvoiceCaption
                      title={'Created On'}
                      text={format(
                        new Date(sub.latest_invoice.created),
                        'd/M/yy'
                      )}
                    />
                    <InvoiceCaption
                      title={'Paid On'}
                      text={
                        sub.latest_invoice.paid
                          ? format(
                              new Date(sub.latest_invoice.created),
                              'd/M/yy'
                            )
                          : 'N/A'
                      }
                    />
                    <InvoiceCaption
                      title={'Total'}
                      text={`£${(sub.latest_invoice.total / 100).toFixed(2)}`}
                    />
                  </Box>
                  <Box>
                    <LightLoadingButton
                      endIcon={
                        sub.latest_invoice.paid ? (
                          <DescriptionOutlinedIcon />
                        ) : (
                          <PaymentOutlinedIcon />
                        )
                      }
                      size="small"
                      sx={{ maxWidth: 'max-content' }}
                      onClick={() =>
                        window.open(sub.latest_invoice.url, '_blank')
                      }
                    >
                      {sub.latest_invoice.paid ? 'Download PDF' : 'Pay Invoice'}
                    </LightLoadingButton>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <Box>
              <Box pb={4}>
                <Subheader
                  color={'text.secondary'}
                  mb={1}
                  text={'Max Locations'}
                />
                <Stack spacing={1} direction="row" alignItems={'center'}>
                  <Typography fontWeight={600} variant={'h4'}>
                    {limits.locations.current} /{' '}
                    {plan_details[plan].location_limit}
                  </Typography>
                </Stack>
              </Box>

              <Box pb={4}>
                <Subheader
                  color={'text.secondary'}
                  mb={1}
                  text={'Max Live Deals'}
                />
                <Stack spacing={1} direction="row" alignItems={'center'}>
                  <Typography fontWeight={600} variant={'h4'}>
                    {limits.deals.current} / {limits.deals.limit}
                  </Typography>
                </Stack>
              </Box>
              <Box pb={4}>
                <Subheader
                  color={'text.secondary'}
                  mb={1}
                  text={'Current Pay Period'}
                />
                <Stack spacing={1} direction="row" alignItems={'center'}>
                  <Typography fontWeight={600} mt={0.5} variant={'body1'}>
                    {format(new Date(sub.current_period.start), 'd/M/yy')} -{' '}
                    {format(new Date(sub.current_period.end), 'd/M/yy')}
                  </Typography>
                  {trialLeft && (
                    <FreeTrialInfo>
                      <AutoAwesomeOutlinedIcon fontSize="small" />
                      {trialLeft} Days left in trial
                    </FreeTrialInfo>
                  )}
                </Stack>
              </Box>
              <Box>
                <Subheader
                  mb={2}
                  color={'text.secondary'}
                  text={'Cancel Subscription'}
                />
                <Box>
                  {user.subscription.has_cancelled ? (
                    <Stack gap={1} direction={'row'} alignItems={'center'}>
                      <LightChip
                        sx={{ width: 'max-content' }}
                        size="small"
                        color="error"
                        label="Cancelled"
                      />

                      <Typography color={'text.secondary'} variant={'caption'}>
                        {user.subscription.subscribed ? `Ends on` : `Ended on`}{' '}
                        {format(
                          new Date(user.subscription.cancelled_period_end),
                          'd/M/yy'
                        )}
                      </Typography>
                    </Stack>
                  ) : (
                    <LightLoadingButton
                      endIcon={<HighlightOffOutlinedIcon />}
                      size="small"
                      onClick={() => setShowCancelSubModal(true)}
                      sx={{ maxWidth: 'max-content' }}
                      color="error"
                    >
                      End Plan
                    </LightLoadingButton>
                  )}
                </Box>
              </Box>
            </Box>
          </PlanInnerContainer>
          <AcceptDeclineModal
            onCancel={() => setShowCancelSubModal(false)}
            onAccept={handleOnCancelSubSubmit}
            acceptText={'Yes, Cancel'}
            cancelText={'Go back'}
            destructive
            submitLoading={cancelSubLoading}
            title={'Cancel your Subscription'}
            subtitle={
              'Are you sure you want to cancel your subscription? Once cancelled all your Locations will become archived and all deals will expire.'
            }
            isOpen={showCancelSubModal}
          />
        </PlanWrapper>
      )}
    </>
  );
};

export default Plan;

/*{plan_details[plan].deal_limit}*/
