import PropTypes from 'prop-types';
// @mui
import { Card, Button, Typography, Box, Stack, styled } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// components
import Label from 'components/label';
import Iconify from 'components/iconify';
// assets
import {
  PlanFreeIcon,
  PlanStarterIcon,
  PlanPremiumIcon
} from '../../assets/icons';
import LightLoadingButton from 'components/light-loading-button/LightLoadingButton';

// ----------------------------------------------------------------------

PricingPlanCard.propTypes = {
  sx: PropTypes.object,
  card: PropTypes.object,
  index: PropTypes.number
};

const labelCols = {
  individual: 'secondary',
  premium: 'success',
  enterprise: 'primary'
};

const CardWrapper = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  border: `dashed 1px ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {}
}));

export default function PricingPlanCard({ card, handleChoosePlan }) {
  const { subscription, price, caption, lists } = card;

  return (
    <CardWrapper>
      <Label sx={{ fontSize: 12 }} color={labelCols[subscription]}>
        {subscription}
      </Label>

      <Stack spacing={1} direction="row" sx={{ my: 2 }}>
        <Typography variant="h5">£</Typography>

        <Typography variant="h2">{price}</Typography>

        <Typography
          component="span"
          sx={{ alignSelf: 'center', color: 'text.secondary' }}
        >
          .99 /mo
        </Typography>
      </Stack>

      <Typography
        variant="caption"
        sx={{
          fontSize: 13,
          color: 'text.secondary',
          textTransform: 'capitalize',
          maxWidth: '20px'
        }}
      >
        {caption}
      </Typography>

      <Box sx={{ width: 80, height: 80, mt: 3 }}>
        {(subscription === 'individual' && <PlanFreeIcon />) ||
          (subscription === 'premium' && <PlanStarterIcon />) || (
            <PlanPremiumIcon />
          )}
      </Box>

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
      <Box display={'flex'} justifyContent={'flex-end'}>
        <LightLoadingButton
          onClick={() => handleChoosePlan(subscription)}
          endIcon={<ArrowForwardIcon fontSize="inherit" />}
        >
          {'Choose Plan'}
        </LightLoadingButton>
      </Box>
    </CardWrapper>
  );
}
