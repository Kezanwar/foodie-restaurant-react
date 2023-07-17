import { styled, Box, alpha } from '@mui/material';

export const StatCardWrapperStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'title'
})(({ theme, title }) => {
  return {
    backgroundColor:
      title === 'Impressions'
        ? alpha(theme.palette.secondary.light, 0.05)
        : title === 'Views'
        ? alpha(theme.palette.info.light, 0.05)
        : title === 'Saves'
        ? alpha(theme.palette.success.light, 0.05)
        : '',
    color:
      title === 'Impressions'
        ? theme.palette.secondary.main
        : title === 'Views'
        ? theme.palette.info.main
        : title === 'Saves'
        ? theme.palette.success.main
        : '',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2)
  };
});
