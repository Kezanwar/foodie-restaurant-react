import PropTypes from 'prop-types';

import { m } from 'framer-motion';
// @mui
import { Box } from '@mui/material';
// hooks

import useResponsive from '../../hooks/useResponsive';
import { useUtilityContext } from '../../hooks/useUtilityContext';

//

// ----------------------------------------------------------------------

MotionDivViewport.propTypes = {
  children: PropTypes.node,
  disableAnimatedMobile: PropTypes.bool
};

export default function MotionDivViewport({
  children,
  disableAnimatedMobile = true,
  ...other
}) {
  const { isBatteryLow } = useUtilityContext();
  const isMobile = useResponsive('down', 'sm');

  if ((isMobile && disableAnimatedMobile) || isBatteryLow) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box component={m.div} {...other}>
      {children}
    </Box>
  );
}
