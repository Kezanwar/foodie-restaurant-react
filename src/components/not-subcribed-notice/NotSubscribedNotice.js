import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { NotSubbedContainerStyled } from './styles';

const NotSubscribedNotice = () => {
  return (
    <NotSubbedContainerStyled>
      <Alert icon={<AnnouncementIcon />} severity={'primary'}>
        <AlertTitle>You haven't subscribed yet!</AlertTitle>
        You can explore the dashboard and get a feel for the system but you'll
        be unable to create a voucher for the customer mobile app until you
        subscribe. <strong>(The first month is free!)</strong>
        <Box mt={2}>
          <Button color="primary" variant="contained">
            Subscribe
          </Button>
        </Box>
      </Alert>
    </NotSubbedContainerStyled>
  );
};

NotSubscribedNotice.propTypes = {};

export default NotSubscribedNotice;
