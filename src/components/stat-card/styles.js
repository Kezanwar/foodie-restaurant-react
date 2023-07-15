import { styled, Box, alpha } from '@mui/material';

export const StatCardWrapperStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'percentage'
})(({ theme, status }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2)
  };
});
