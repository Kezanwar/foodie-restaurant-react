import { Box, IconButton, styled } from '@mui/material';

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

export const SearchWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center'
}));

export const IconBtn = styled(IconButton)(() => ({
  height: '100%',
  aspectRatio: '1/1'
}));
