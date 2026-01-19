import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { NotSubbedContainerStyled } from './styles';
import { useLocation, useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import useAuthStore from 'stores/auth';

const NotSubscribedNotice = () => {
  const page = useLocation();
  const user = useAuthStore((state) => state.user);

  const nav = useNavigate();
  const [isSubscriptionPage, setIsSubscriptionPage] = useState(false);

  useEffect(() => {
    setIsSubscriptionPage(page.pathname.includes('subscription'));
  }, [page.pathname]);

  const navToSubscription = () => nav(PATH_DASHBOARD.subscription);

  const hasPreviouslySubscribed = !!(
    user.subscription || user.past_subscriptions.length
  );

  return (
    <NotSubbedContainerStyled>
      <Alert icon={<AnnouncementIcon />} severity={'info'}>
        <AlertTitle>
          {hasPreviouslySubscribed
            ? "You aren't subscribed anymore..."
            : "You haven't subscribed yet!"}
        </AlertTitle>
        {hasPreviouslySubscribed ? (
          'You must resubscribe to use the Foodie Platform again.'
        ) : (
          <>
            You can explore the dashboard and get a feel for the system but
            you'll be unable to create a deal for the customer mobile app until
            you subscribe. <strong>(The first month is free!)</strong>
          </>
        )}
        {!isSubscriptionPage && (
          <Box mt={2}>
            <Button
              onClick={navToSubscription}
              color="info"
              variant="contained"
            >
              {hasPreviouslySubscribed ? 'Resubcribe' : 'Subscribe'}
            </Button>
          </Box>
        )}
      </Alert>
    </NotSubbedContainerStyled>
  );
};

NotSubscribedNotice.propTypes = {};

export default NotSubscribedNotice;
