// @mui
import { Card, Typography, Box, Stack, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import PlanLabel from 'components/plan-label';

import { CancelOutlined } from '@mui/icons-material';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import BlackLoadingButton from 'components/black-loading-button/BlackLoadingButton';

import { memo } from 'react';

const CardWrapper = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  border: `dashed 1px ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {},
  boxShadow: 'none'
}));

function PricingPlanCard({
  card,
  handleChoosePlan,
  isLoading,
  currentTier,
  userSub
}) {
  const { subscription, price, caption, lists } = card;

  const isEnterprise = subscription === 'enterprise';

  const { isTablet } = useCustomMediaQueries();

  const isCurrentTier = userSub?.subscribed && currentTier === subscription;

  return (
    <CardWrapper>
      <PlanLabel plan={subscription} />

      <Stack spacing={1} direction="row" sx={{ my: 2 }}>
        {!isEnterprise && <Typography variant="h5">£</Typography>}

        <Typography
          mt={isEnterprise ? 0.75 : 0}
          mb={isEnterprise ? 0.75 : 0}
          variant={!isEnterprise ? 'h2' : 'h3'}
        >
          {price}
        </Typography>

        {!isEnterprise && (
          <Typography
            component="span"
            sx={{ alignSelf: 'center', color: 'text.secondary' }}
          >
            /mo{' '}
            <Typography component={'span'} variant="caption">
              incl VAT
            </Typography>
          </Typography>
        )}
      </Stack>

      <Typography
        variant="caption"
        sx={{
          fontSize: 13,
          color: 'text.secondary',
          display: 'block',
          width: '90%'
        }}
      >
        {caption}
      </Typography>

      <Stack component="ul" spacing={2} sx={{ p: 0, mt: 4, mb: 5 }}>
        {lists.map((item) => (
          <Stack
            key={item.text}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              typography: 'body2',
              color: item.isAvailable ? 'text.primary' : 'text.disabled'
            }}
          >
            {item.isAvailable ? (
              <CheckCircleOutlinedIcon fontSize="small" color="success" />
            ) : (
              <CancelOutlined fontSize="small" color="inherit" />
            )}
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>
      <Box display={'flex'} justifyContent={isTablet ? 'flex-end' : undefined}>
        <BlackLoadingButton
          loading={isLoading}
          size="md"
          disabled={isCurrentTier}
          onClick={() => handleChoosePlan(subscription)}
          endIcon={
            isCurrentTier ? (
              <BookmarkAddedOutlinedIcon />
            ) : (
              <ArrowForwardIcon fontSize="inherit" />
            )
          }
        >
          {isEnterprise
            ? 'Contact Sales'
            : isCurrentTier
            ? 'Current Plan'
            : 'Choose Plan'}
        </BlackLoadingButton>
      </Box>
    </CardWrapper>
  );
}

export default memo(PricingPlanCard);
