import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from 'hooks/useResponsive';
// config
import { HEADER, NAV } from '../../config';

// ----------------------------------------------------------------------

const SPACING = 8;

Main.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node
};

export default function Main({ children, sx, ...other }) {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: `${HEADER.H_MOBILE + SPACING}px`,
        ...(isDesktop && {
          px: 2,
          pt: `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_DASHBOARD}px)`
        }),
        ...sx
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
