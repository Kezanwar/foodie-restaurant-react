import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import Logo from '../logo';
import ProgressBar from '../progress-bar';
import LoadinLottie from '../loading-lottie/LoadingLottie';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9998,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

const sx = {
  marginTop: '-30px',
  scale: '1.2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
};

export default function LoadingScreen() {
  return (
    <>
      <ProgressBar />

      <StyledRoot>
        <Box sx={sx}>
          <LoadinLottie />
          <Logo />
        </Box>
        {/* <m.div
          animate={{
            scale: [1, 0.9, 0.9, 1, 1],
            opacity: [1, 0.48, 0.48, 1, 1]
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeatDelay: 1,
            repeat: Infinity
          }}
        />

        <Box
          component={m.div}
          animate={{
            scale: [1.2, 1, 1, 1.2, 1.2],
            rotate: [270, 0, 0, 270, 270],
            opacity: [0.25, 1, 1, 1, 0.25],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
          sx={{
            width: 200,
            height: 200,
            position: 'absolute',
            border: (theme) =>
              `solid 2px ${alpha(theme.palette.primary.main, 0.34)}`
          }}
        />

        <Box
          component={m.div}
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 270, 270, 0, 0],
            opacity: [1, 0.25, 0.25, 0.25, 1],
            borderRadius: ['25%', '25%', '50%', '50%', '25%']
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity
          }}
          sx={{
            width: 170,
            height: 170,
            position: 'absolute',
            border: (theme) =>
              `solid 4px ${alpha(theme.palette.primary.dark, 0.14)}`
          }}
        /> */}
      </StyledRoot>
    </>
  );
}
