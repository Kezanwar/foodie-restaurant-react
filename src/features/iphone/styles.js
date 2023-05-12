import { Box, styled } from '@mui/material';

export const CoverPhotoContainer = styled(Box)(({ url, theme }) => ({
  width: '100%',
  borderTopRightRadius: '42px',
  borderTopLeftRadius: '42px',
  backgroundSize: 'cover!important',
  height: '275px',
  background: url,
  display: 'flex!important',
  alignItems: 'end',
  padding: theme.spacing(3)
}));

export const MainSection = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '-20px',
  borderTopRightRadius: '12px',
  borderTopLeftRadius: '12px',
  boxShadow: theme.shadows[4],
  zIndex: '2000',
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  position: 'relative',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

export const VouchersSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

export const VoucherContainer = styled(Box)(({ theme, i }) => ({
  position: 'relative',
  display: 'flex!important',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  justifyContent: 'space-between',
  border: `1.2px dashed ${theme.palette.primary.lighter}`,
  borderRadius: '10px',
  marginBottom: theme.spacing(i !== 2 ? 3 : 0),
  padding: theme.spacing(2),
  cursor: 'pointer'
}));

export const VoucherIconBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  paddingRight: 0.7,
  paddingBottom: 0,
  position: 'absolute',
  left: '2px',
  top: '2px',
  color: theme.palette.primary.light,
  transform: 'translateX(-50%) translateY(-50%) scale(0.75) '
}));
