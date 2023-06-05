// @mui
import { styled, alpha } from '@mui/material/styles';
// utils

// ----------------------------------------------------------------------

export const StyledRoot = styled('main')(() => ({
  minHeight: '60%',
  display: 'flex',
  position: 'relative'
}));

export const StyledSection = styled('div')(({ theme }) => ({
  display: 'none',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}));

export const StyledContent = styled('div')(({ theme }) => ({
  width: 800,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(20, 2),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    flexShrink: 0,
    padding: theme.spacing(20, 8, 0, 8)
  }
}));
