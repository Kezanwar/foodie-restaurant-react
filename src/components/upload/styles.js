import { Box, styled } from '@mui/material';

export const CropModalContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  overflowY: 'scroll',
  height: 'auto',
  maxHeight: '95vh',
  maxWidth: '95vw',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 0,
    height: '100vh',
    maxHeight: '100vh',
    maxWidth: '100vw'
  }
}));
