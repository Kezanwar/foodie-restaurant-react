import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// components
import Main from './Main';
import Header from './header';
import NavVertical from './nav/NavVertical';

import { PATH_NEW_RESTAURANT } from '../../routes/paths';
import useRestaurantQuery from '../../hooks/queries/useRestaurantQuery';
import { RESTAURANT_STATUS } from '../../constants/restaurants.constants';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoading, data, isFetched } = useRestaurantQuery();

  useEffect(() => {
    if (
      (isFetched && !data?.data.status) ||
      data?.data.status === RESTAURANT_STATUS.APPLICATION_PENDING ||
      data?.data.status === RESTAURANT_STATUS.APPLICATION_PROCESSING
    )
      navigate(PATH_NEW_RESTAURANT.new_restaurant);
  }, [isFetched, data?.data.status, navigate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  return isLoading ? (
    <LoadingScreen />
  ) : isFetched &&
    data?.data.status === RESTAURANT_STATUS.APPLICATION_REJECTED ? (
    // TODO - ADD APPLICATION REJECTED PAGE
    <Box>application rejected</Box>
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
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
