import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Badge, Avatar } from '@mui/material';

// ----------------------------------------------------------------------

const CustomAvatar = forwardRef(({ color, name = '', BadgeProps, children, sx, ...other }, ref) => {
  const theme = useTheme();

  const { color: colorByName, name: charAtName } = getColorByName(name);

  const colr = color || colorByName;

  const renderContent =
    colr === 'default' ? (
      <Avatar ref={ref} sx={sx} {...other}>
        {name && charAtName}
        {children}
      </Avatar>
    ) : (
      <Avatar
        ref={ref}
        sx={{
          color: theme.palette[colr]?.contrastText,
          backgroundColor: theme.palette[colr]?.main,
          fontWeight: theme.typography.fontWeightLight,
          ...sx,
        }}
        {...other}
      >
        {name && charAtName}
        {children}
      </Avatar>
    );

  return BadgeProps ? (
    <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} {...BadgeProps}>
      {renderContent}
    </Badge>
  ) : (
    renderContent
  );
});

CustomAvatar.propTypes = {
  sx: PropTypes.object,
  name: PropTypes.string,
  children: PropTypes.node,
  BadgeProps: PropTypes.object,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
};

export default CustomAvatar;

// ----------------------------------------------------------------------

function getColorByName(name) {
  const character = (name) => name && name.charAt(0).toUpperCase();

  const colorByName = (name) => {
    if (['A', 'N', 'H', 'L', 'Q'].includes(character(name))) return 'primary';
    if (['F', 'G', 'T', 'I', 'J'].includes(character(name))) return 'info';
    if (['K', 'D', 'Y', 'B', 'O'].includes(character(name))) return 'success';
    if (['P', 'E', 'R', 'S', 'U'].includes(character(name))) return 'warning';
    if (['V', 'W', 'X', 'M', 'Z'].includes(character(name))) return 'error';
    return 'default';
  };

  return {
    name: character(name),
    color: colorByName(name),
  };
}
