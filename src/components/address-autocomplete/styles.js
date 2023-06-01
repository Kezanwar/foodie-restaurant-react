import { Box, styled } from '@mui/material';

export const AddressSearchUnderWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

export const LoadingWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center'
}));
