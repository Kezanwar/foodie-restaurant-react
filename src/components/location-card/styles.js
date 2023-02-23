import { alpha, Box, Card, styled, CardActionArea } from '@mui/material';

export const LocationCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${alpha(theme.palette.primary.lighter, 0.75)}`,
  //   boxShadow: theme.shadows[19],
  width: `calc(25% - ${theme.spacing(2.25)})`,
  padding: theme.spacing(2.5),
  borderRadius: '10px',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    width: `calc(33.33% - ${theme.spacing(2)})`
  },
  [theme.breakpoints.down('sm')]: {
    width: `calc(50% - ${theme.spacing(2)})`
  }
}));
