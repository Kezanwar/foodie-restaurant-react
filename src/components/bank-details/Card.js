import React from 'react';
import { Box, Typography } from '@mui/material';
import { cardBrandIcons, cardBrandColors } from './details';
import { format } from 'date-fns';

const Card = ({ billingData }) => {
  const { card, billing_details, created } = billingData;
  const { brand, last4, exp_month, exp_year } = card;
  const Icon = cardBrandIcons[brand.toLowerCase()] || cardBrandIcons.default;
  const backgroundColor =
    cardBrandColors[brand.toLowerCase()] || cardBrandColors.default;

  const formattedDate = created
    ? format(new Date(created * 1000), 'PPP')
    : null;

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box color={backgroundColor}>
          <Icon size={40} />
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography fontWeight={'bold'} variant="body1">
          Card Ending in: **** {last4}
        </Typography>
      </Box>
      <Typography color={'text.secondary'} variant="body2">
        Expiration: {exp_month}/{exp_year}
      </Typography>
      {formattedDate && (
        <Typography color={'text.secondary'} variant="body2">
          Added: {formattedDate}
        </Typography>
      )}
      <Box mt={2}>
        <Typography variant="body2" fontWeight="bold">
          Cardholder:
        </Typography>
        <Typography color={'text.secondary'} variant="body1">
          {billing_details.name || 'N/A'}
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="body2" fontWeight="bold">
          Billing Address:
        </Typography>
        <Typography color={'text.secondary'} variant="body1">
          {billing_details.address.line1 &&
            `${billing_details.address.line1}, `}{' '}
          {billing_details.address.postal_code},{' '}
          {billing_details.address.country}
        </Typography>
      </Box>
    </>
  );
};

export default Card;
