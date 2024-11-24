import React from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';

const Icon = () => (
  <svg
    width={60}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 24"
    fill="none"
  >
    <title>Link</title>
    <path
      fill="currentColor"
      d="M36.12 3.67683c0-1.12801.9504-2.04481 2.0688-2.04481 1.1184 0 2.0688.9216 2.0688 2.04481 0 1.1232-.9168 2.0688-2.0688 2.0688-1.152 0-2.0688-.9168-2.0688-2.0688ZM29.9808 1.92001h3.6V22.08h-3.6V1.92001ZM40.008 7.68001h-3.6288V22.08h3.6288V7.68001ZM66.096 14.3904c2.7312-1.68 4.5888-4.1808 5.3232-6.71516h-3.6288c-.9456 2.41916-3.1152 4.23836-5.5008 5.01116V1.91523h-3.6288V22.0752h3.6288V16.08c2.7696.6912 4.9584 3.0864 5.7072 5.9952h3.6528c-.5568-3.0528-2.6448-5.9088-5.5536-7.6848ZM46.44 9.29283c.9504-1.2624 2.8032-1.99681 4.3056-1.99681 2.8032 0 5.1216 2.04961 5.1264 5.14558v9.6336h-3.6288v-8.832c0-1.272-.5664-2.7408-2.4048-2.7408-2.16 0-3.4032 1.9152-3.4032 4.1568v7.4256h-3.6288V7.68962H46.44v1.60321Z"
    />
    <path
      fill="#00D66F"
      d="M12 24c6.6274 0 12-5.3726 12-12 0-6.62743-5.3726-12-12-12C5.37259 0 0 5.37257 0 12c0 6.6274 5.37259 12 12 12Z"
    />
    <path
      fill="#011e0f"
      d="M11.4479 4.80005H7.74707c.72 3.0096 2.82243 5.58235 5.45283 7.19995-2.6352 1.6176-4.73283 4.1904-5.45283 7.2h3.70083c.9168-2.784 3.456-5.2032 6.576-5.6976v-3.0095c-3.1248-.4896-5.664-2.90885-6.576-5.69285Z"
    />
  </svg>
);

const Link = ({ billingData }) => {
  const { billing_details, created, link } = billingData;
  const formattedDate = created
    ? format(new Date(created * 1000), 'PPP')
    : null;
  return (
    <div>
      <Box mb={2} display={'flex'} gap={1} alignItems={'center'}>
        <Icon />
        <Typography color={'text.secondary'} variant="body2">
          {link.email}
        </Typography>
      </Box>

      {formattedDate && (
        <Box mt={2}>
          <Typography variant="body2" fontWeight="bold">
            Created On:
          </Typography>
          <Typography color={'text.secondary'} variant="body2">
            {formattedDate}
          </Typography>
        </Box>
      )}
      <Box mt={2}>
        <Typography variant="body2" fontWeight="bold">
          Cardholder:
        </Typography>
        <Typography color={'text.secondary'} variant="body1">
          {billing_details.name || 'N/A'}
        </Typography>
      </Box>
    </div>
  );
};

export default Link;
