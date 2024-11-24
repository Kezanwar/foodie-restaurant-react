// @mui
import { Card, Typography, Box, Stack, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
// components

import Iconify from 'components/iconify';
// assets
// import {
//   PlanFreeIcon,
//   PlanStarterIcon,
//   PlanPremiumIcon
// } from '../../assets/icons';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import BlackLoadingButton from 'components/black-loading-button/BlackLoadingButton';
import PlanLabel from 'components/plan-label';

const CardWrapper = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  border: `dashed 1px ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {},
  boxShadow: 'none'
}));

export default function PricingPlanCard({
  card,
  handleChoosePlan,
  isLoading,
  currentTier
}) {
  const { subscription, price, caption, lists } = card;

  const isEnterprise = subscription === 'enterprise';

  const { isTablet } = useCustomMediaQueries();

  const isCurrentTier = currentTier === subscription;

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
            /mo
          </Typography>
        )}
      </Stack>

      <Typography
        variant="caption"
        sx={{
          fontSize: 13,
          color: 'text.secondary',

          maxWidth: '20px'
        }}
      >
        {caption}
      </Typography>

      {/* <Box sx={{ width: 80, height: 80, mt: 3 }}>
        {(subscription === 'individual' && <PlanFreeIcon />) ||
          (subscription === 'premium' && <PlanStarterIcon />) || (
            <PlanPremiumIcon />
          )}
      </Box> */}

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
            <Iconify
              icon={item.isAvailable ? 'eva:checkmark-fill' : 'eva:close-fill'}
              width={16}
              sx={{
                color: item.isAvailable ? 'success.main' : 'inherit'
              }}
            />
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
