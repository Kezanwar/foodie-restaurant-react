import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// components
import Main from './Main';
import Header from './header';
import NavVertical from './nav/NavVertical';

import { usePathAfterLogin } from '../../hooks/usePathAfterLogin';
import { PATH_NEW_RESTAURANT } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const pathAfterLogin = usePathAfterLogin();

  useEffect(() => {
    if (pathAfterLogin === PATH_NEW_RESTAURANT.new_restaurant)
      navigate(pathAfterLogin);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

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
