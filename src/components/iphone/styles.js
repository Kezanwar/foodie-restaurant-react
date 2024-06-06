import { Box, styled } from '@mui/material';

export const CoverPhotoContainer = styled(Box)(({ url, theme }) => ({
  width: '100%',
  borderTopRightRadius: '42px',
  borderTopLeftRadius: '42px',
  backgroundSize: 'cover!important',
  height: '300px',
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

export const DealsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

export const DealContainer = styled(Box)(({ theme, i }) => ({
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

export const DealIconBox = styled(Box)(({ theme }) => ({
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

export const RestaurantProfilePhoneContentWrapper = styled(Box, {
  shouldForwardProp: (p) => p !== 'phoneHeight' && p !== 'phoneWidth'
})(({ theme, phoneHeight, phoneWidth }) => ({
  height: phoneHeight - 40,
  paddingBottom: 0,
  backgroundColor: theme.palette.background.paper,
  width: phoneWidth - 38,
  overflowY: 'scroll',
  borderRadius: '49px',
  '&::-webkit-scrollbar': {
    width: 0,
    borderRadius: 5
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
    width: 0
  },
  '&::-webkit-scrollbar-thumb': {
    width: 0
  }
}));

export const LinearGradientSeparator = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1.2px',
  boxShadow: theme.shadows[19],
  background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main} 10%, ${theme.palette.primary.lighter} 90%)`
}));

export const DietaryCuisinesChipsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex!important',
  flexWrap: 'wrap',
  gap: theme.spacing(1)
}));
