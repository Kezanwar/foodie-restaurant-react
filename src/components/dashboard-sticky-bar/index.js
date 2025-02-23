import { Box, styled } from '@mui/material';

const DashboardStickyBar = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 50,
  zIndex: theme.zIndex.appBar,
  backgroundColor: theme.palette.background.paper,
  borderBottom: 1,
  borderColor: theme.palette.divider
}));

export default DashboardStickyBar;
