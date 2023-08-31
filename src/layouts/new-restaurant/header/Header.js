import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, Box } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config';
// components
import Logo from '../../../components/logo';
import { useSettingsContext } from '../../../components/settings';
//

import AccountPopover from './AccountPopover';
import ModeOptions from '../../../components/settings/ModeOptions';

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func
};

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;

  const renderContent = (
    <>
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        {/* <LanguagePopover /> */}
        <Box mr={1}>
          <ModeOptions />
        </Box>

        {/* <ContactsPopover /> */}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        background: 'none',
        paddingBottom: 2,
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        // ...bgBlur({
        //   color: theme.palette.background.default
        // }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter
        }),
        ...(isDesktop && {
          width: `100%`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`
          })
        })
      }}
    >
      <Box
        px={4}
        py={isDesktop ? 2 : 1}
        sx={{
          display: 'flex',
          ...bgBlur({
            color: theme.palette.background.default
          })
        }}
      >
        <Logo />
        {renderContent}
      </Box>
    </AppBar>
  );
}
