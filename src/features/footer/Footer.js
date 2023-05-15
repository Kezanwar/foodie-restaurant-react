import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FooterContainer, FooterGrid } from './styles';
import Logo from '../../components/logo/Logo';

const Footer = (props) => {
  return (
    <FooterContainer>
      <FooterGrid
      // sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0 }}
      // zIndex={'1'}
      // px={30}
      // pt={10}
      // pb={5}
      >
        <Box mt={-2} letterSpacing={-0.5}>
          <Logo />
          <Typography variant="body2">© foodie limited</Typography>
          <Typography variant="body2">all rights reserved</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,

            letterSpacing: -0.5
          }}
        >
          <Typography variant="h6">Company</Typography>
          <Typography variant="body2">About us</Typography>
          <Typography variant="body2">Meet the team</Typography>
          <Typography variant="body2">FAQ</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,

            letterSpacing: -0.5
          }}
        >
          <Typography variant="h6">Product</Typography>
          <Typography variant="body2">Help guide</Typography>
          <Typography variant="body2">Pricing</Typography>
          <Typography variant="body2">Testimonials</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,

            letterSpacing: -0.5
          }}
        >
          <Typography variant="h6">Legals</Typography>
          <Typography variant="body2">Terms and conditions</Typography>
          <Typography variant="body2">Privacy policy</Typography>
          <Typography variant="body2">Support</Typography>
        </Box>
      </FooterGrid>
    </FooterContainer>
  );
};

Footer.propTypes = {};

export default Footer;
