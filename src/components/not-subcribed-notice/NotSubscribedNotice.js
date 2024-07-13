import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { NotSubbedContainerStyled } from './styles';
import { useLocation } from 'react-router';

const NotSubscribedNotice = () => {
  const page = useLocation();
  const [isSubscriptionPage, setIsSubscriptionPage] = useState(false);
  useEffect(() => {
    setIsSubscriptionPage(page.pathname.includes('subscription'));
  }, [page.pathname]);
  return (
    <NotSubbedContainerStyled>
      <Alert icon={<AnnouncementIcon />} severity={'info'}>
        <AlertTitle>You haven't subscribed yet!</AlertTitle>
        You can explore the dashboard and get a feel for the system but you'll
        be unable to create a deal for the customer mobile app until you
        subscribe. <strong>(The first month is free!)</strong>
        {!isSubscriptionPage && (
          <Box mt={2}>
            <Button color="info" variant="contained">
              Subscribe
            </Button>
          </Box>
        )}
      </Alert>
    </NotSubbedContainerStyled>
  );
};

NotSubscribedNotice.propTypes = {};

export default NotSubscribedNotice;
