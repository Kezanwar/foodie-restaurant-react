import { Stack } from '@mui/material';
import { StyledContent, StyledRoot } from './styles';
import Logo from '../../components/logo/Logo';
import Header from './header';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function NewRestaurantLayout({ children, illustration, title }) {
  // const { initialRestaurantStatus, isAuthenticated, isInitialized } =
  //   useAuthContext();

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
    <StyledRoot>
      <Header />

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
