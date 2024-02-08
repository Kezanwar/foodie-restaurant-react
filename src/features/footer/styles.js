import { Box, styled } from '@mui/material';
import FooterBG from 'assets/footer-bg.svg';
import FooterBGMobile from 'assets/footer-bg-mob.svg';

export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(20),
  paddingTop: theme.spacing(6),
  minHeight: '30vh',
  background: `url(${FooterBG})`,
  backgroundSize: '100%',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(12),
    background: `url(${FooterBGMobile})`,
    minHeight: '30vh',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat'
  }
}));

export const FooterGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr',
  zIndex: 1,
  gap: 0,
  paddingLeft: theme.spacing(50),
  paddingRight: theme.spacing(35),
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.down(1400)]: {
    gridTemplateColumns: '1.75fr 1fr 1fr 1fr',
    paddingLeft: theme.spacing(25),
    paddingRight: theme.spacing(20)
  },
  [theme.breakpoints.down(999)]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    padding: theme.spacing(6)
  },
  [theme.breakpoints.down(768)]: {
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
    gap: theme.spacing(6)
  }
}));
