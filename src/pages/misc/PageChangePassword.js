import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';

const PageConfirmEmail = (props) => {
  const { isTablet, isMobile } = useCustomMediaQueries();

  const navigate = useNavigate();

  const [OTP, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <>
      <Helmet>
        <title> Change Password | Foodie</title>
      </Helmet>

      <Box></Box>
    </>
  );
};

PageConfirmEmail.propTypes = {};

export default PageConfirmEmail;
