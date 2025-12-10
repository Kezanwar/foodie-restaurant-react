import { alpha, Box, styled } from '@mui/material';

export const MainContent = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  width: '480px',
  maxWidth: '95vw',
  borderRadius: 1
}));

export const StyledMapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .leaflet-container': {
    height: 320,
    margin: '0 auto',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down(420)]: {
      height: 200
    }
  }
}));

export const StyledMapDragMarkerMessage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  zIndex: '5000',
  right: '12px',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.white, 0.3),
  boxShadow: theme.shadows[12],
  backdropFilter: 'blur(4px)'
}));

export const StyledLowerContentContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative'
}));
