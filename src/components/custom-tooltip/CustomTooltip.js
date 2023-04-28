import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TooltipText = React.forwardRef(({ text, ...rest }, ref) => {
  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer'
      }}
    >
      <HelpOutlineIcon />
      {text && <Typography fontSize={'14px'}>{text}</Typography>}
    </Box>
  );
});

const CustomTooltip = ({ tooltipText, text }) => {
  return (
    <Tooltip title={tooltipText}>
      <TooltipText text={text} />
    </Tooltip>
  );
};

CustomTooltip.propTypes = {
  tooltipText: PropTypes.string,
  text: PropTypes.string
};

export default CustomTooltip;
