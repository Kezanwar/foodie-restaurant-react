import { Box, styled } from '@mui/material';

export const CustomHeaderCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 600,
  '& svg': {
    height: '1.25rem',
    marginRight: '0.25rem',
    marginLeft: '-0.225rem'
  }
  // [theme.breakpoints.down(768)]: {
  //   '& svg': {
  //     display: 'none'
  //   }
  // }
}));
