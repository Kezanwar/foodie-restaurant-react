import React from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import PlanLabel, { StyledLabel } from 'components/plan-label';
import Subheader from 'components/subheader/Subheader';

import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';

import Permissions from 'utils/permissions';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import useSubscriptionQuery from 'hooks/queries/useSubscriptionQuery';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { PlanLoading } from './styles';

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
  // gridAutoRows: '1fr',
  gap: theme.spacing(12),

  // gap: theme.spacing(6),
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
    price: 55,
    caption:
      'The perfect package for individual Restaurants with a single location',
    location_limit: 1,
    deal_limit: 5
  },
  premium: {
    price: 100,
    caption: 'Ideal package for a medium sized business with 2-5 locations',
    location_limit: 5,
    deal_limit: 25
  },
  enterprise: {
    price: 'Contact Sales',
    caption: 'Ideal package for multi-chain Restaurants with 6+ locations'
  }
};

const Plan = () => {
  const query = useRestaurantQuery();

  const rest = query?.data?.data;

  const plan = Permissions.getTier(rest?.tier);

  const subQuery = useSubscriptionQuery();

  const sub = subQuery?.data?.data;

  const trialLeft =
    sub?.trial_end && sub.trial_end > sub.current_period.start
      ? differenceInDays(sub.trial_end, Date.now()) + 1
      : null;

  const { isMobile } = useCustomMediaQueries();

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
                    /mo
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
                      sx={{ maxWidth: 'max-content', px: 1.5 }}
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
                    {plan_details[plan].deal_limit}
                  </Typography>
                </Stack>
              </Box>
              <Box>
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
            </Box>
          </PlanInnerContainer>
        </PlanWrapper>
      )}
    </>
  );
};

export default Plan;
