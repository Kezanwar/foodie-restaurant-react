import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// components
//
import Main from './Main';
import Header from './header';
import NavVertical from './nav/NavVertical';
import { useAuthContext } from '../../hooks/useAuthContext';
import { RESTAURANT_STATUS } from '../../constants/restaurants.constants';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { initialRestaurantStatus, isAuthenticated, isInitialized } =
    useAuthContext();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  // useEffect(() => {
  //   if (isAuthenticated && isInitialized) {
  //     if (
  //       !initialRestaurantStatus ||
  //       initialRestaurantStatus === RESTAURANT_STATUS.APPLICATION_PENDING ||
  //       initialRestaurantStatus === RESTAURANT_STATUS.APPLICATION_PROCESSING
  //     ) {
  //       navigate(PATH_NEW_RESTAURANT.new_restaurant);
  //     }
  //   }
  // }, [initialRestaurantStatus, isAuthenticated, isInitialized]);

  return (
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
