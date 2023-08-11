import { styled, Box, alpha } from '@mui/material';

export const StatCardWrapperStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'title'
})(({ theme, title }) => {
  return {
    backgroundColor:
      title === 'Impressions'
        ? alpha(theme.palette.secondary.light, 0.04)
        : title === 'Views'
        ? alpha(theme.palette.info.light, 0.04)
        : title === 'Saves'
        ? alpha(theme.palette.success.light, 0.04)
        : title === 'Booking Clicks'
        ? alpha(theme.palette.warning.light, 0.04)
        : title === 'Favourites'
        ? alpha(theme.palette.error.light, 0.04)
        : '',
    color:
      title === 'Impressions'
        ? theme.palette.secondary.main
        : title === 'Views'
        ? theme.palette.info.main
        : title === 'Saves'
        ? theme.palette.success.main
        : title === 'Booking Clicks'
        ? theme.palette.warning.main
        : title === 'Favourites'
        ? theme.palette.error.main
        : '',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2)
  };
});
