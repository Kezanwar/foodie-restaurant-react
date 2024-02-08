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
import { RESTAURANT_STATUS } from 'constants/restaurants.constants';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoading, data, isFetched } = useRestaurantQuery();

  useEffect(() => {
    if (
      (isFetched && !data?.data?.status) ||
      data?.data?.status === RESTAURANT_STATUS.APPLICATION_PENDING ||
      data?.data?.status === RESTAURANT_STATUS.APPLICATION_PROCESSING ||
      data?.data?.status === RESTAURANT_STATUS.APPLICATION_REJECTED
    )
      navigate(PATH_NEW_RESTAURANT.new_restaurant);
  }, [isFetched, data?.data?.status, navigate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  const isSubscribed = data?.data?.is_subscribed;

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
          {/* <Footer /> */}
        </Main>
      </Box>
    </>
  );
}
