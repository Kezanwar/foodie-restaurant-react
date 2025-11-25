import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import Main from './Main';
import Header from './header';
import NavVertical from './nav/NavVertical';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import NotSubscribedNotice from 'components/not-subcribed-notice/NotSubscribedNotice';

import { PATH_NEW_RESTAURANT } from 'routes/paths';
import useRestaurantQuery from 'hooks/queries/useRestaurantQuery';
import Permissions from 'lib/permissions';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoading, data, isFetched } = useRestaurantQuery();

  const status = data?.restaurant?.status;

  useEffect(() => {
    if (isFetched) {
      if (
        !status ||
        Permissions.isApplicationPending(status) ||
        Permissions.isApplicationRejected(status)
      )
        navigate(PATH_NEW_RESTAURANT.new_restaurant);
    }
  }, [isFetched, status, navigate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  const isSubscribed = data?.restaurant?.is_subscribed;

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Header onOpenNav={handleOpen} />
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 }
        }}
      >
        {renderNavVertical}
        <Main>
          {!isSubscribed && <NotSubscribedNotice />}
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
