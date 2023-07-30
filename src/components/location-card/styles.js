import { alpha, Box, Card, styled, CardActionArea, Stack } from '@mui/material';
import { m } from 'framer-motion';
import MotionDivViewport from '../animate/MotionDivViewport';

export const LocationCardStyled = styled(MotionDivViewport)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `2px solid ${alpha(theme.palette.primary.lighter, 0.75)}`,
  //   boxShadow: theme.shadows[19],
  width: `calc(33.33% - ${theme.spacing(2)})`,
  padding: theme.spacing(2.5),
  borderRadius: '10px',
  position: 'relative',
  [theme.breakpoints.down(1200)]: {
    width: `calc(50% - ${theme.spacing(1.5)})`
  },
  [theme.breakpoints.down(800)]: {
    width: '100%'
  }
}));

export const LocationCardsContainer = styled(m.div)(({ theme }) => ({
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
