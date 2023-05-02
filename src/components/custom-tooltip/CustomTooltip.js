import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography } from '@mui/material';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const TooltipText = React.forwardRef(({ text, ...rest }, ref) => {
  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        color: 'info.main'
      }}
    >
      <ContactSupportIcon />
      {text && <Typography fontSize={'14px'}>{text}</Typography>}
    </Box>
  );
});

const CustomTooltip = ({ tooltipText, text, ...rest }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {...rest}>
      <Tooltip enterTouchDelay={0} color="primary" title={tooltipText}>
        <TooltipText text={text} />
      </Tooltip>
    </Box>
  );
};

CustomTooltip.propTypes = {
  tooltipText: PropTypes.string,
  text: PropTypes.string
};

export default CustomTooltip;
