import { Box, styled } from '@mui/material';

export const NotSubbedContainerStyled = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
  //   [theme.breakpoints.up(999)]: { maxWidth: '51%' }
}));
