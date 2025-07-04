import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Box } from '@mui/material';
// config
import { HEADER } from '../../config';
// utils
import { bgBlur } from 'utils/cssStyles';
// components
import Logo from 'components/logo';

import AccountPopover from './AccountPopover';

import useResponsive from 'hooks/useResponsive';

import useAuthStore from 'stores/auth';

// ----------------------------------------------------------------------

Header.propTypes = {
  isOffset: PropTypes.bool
};

export default function Header({ isOffset }) {
  const theme = useTheme();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isDesktop = useResponsive('up', 'lg');

  return (
    <AppBar
      color="transparent"
      sx={{
        boxShadow: 'none',
        ...bgBlur({
          color: theme.palette.background.default
        })
      }}
    >
      <Toolbar
        sx={{
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16
            }
          })
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            px: 1,
            py: isDesktop ? 2 : 1
          }}
        >
          <Logo />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* <Link variant="subtitle2" color="inherit">
            Need Help?
          </Link> */}
            {/* <ModeOptions /> */}
            {isAuthenticated ? <AccountPopover /> : null}
          </Box>
        </Box>
      </Toolbar>

      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object
};

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx
      }}
      {...other}
    />
  );
}
