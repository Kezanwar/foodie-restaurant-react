import { Box, styled } from '@mui/material';
import { m } from 'framer-motion';
import MotionDivViewport from '../animate/MotionDivViewport';

export const LocationCardStyled = styled(MotionDivViewport, {
  shouldForwardProp: (p) => p !== 'layout'
})(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `dashed 1px ${theme.palette.divider}`,
  //   boxShadow: theme.shadows[19],
  width: `calc(33.33% - ${theme.spacing(2)})`,
  padding: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  position: 'relative',
  [theme.breakpoints.down(1200)]: {
    width: `calc(50% - ${theme.spacing(1.5)})`
  },
  [theme.breakpoints.down(800)]: {
    width: '100%'
  }
}));

export const LocationCardsContainer = styled(m.div)(() => ({
  marginbottom: 6,
  flexDirection: 'row',
  gap: 3,
  flexWrap: 'wrap'
}));

export const EditIconsWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(1.5),
  display: 'flex'
}));
