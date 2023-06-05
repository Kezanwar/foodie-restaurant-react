import { capitalCase } from 'change-case';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../hooks/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();
  const { data } = useRestaurantQuery();

  const restaurantName = data?.data?.name;
  return (
    <StyledRoot>
      <CustomAvatar
        src={user?.avatar}
        alt={user?.first_name}
        name={user?.first_name}
      />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={'500'} noWrap>
          {`${user?.first_name} ${user?.last_name}`}
        </Typography>

        <Typography
          variant="body2"
          noWrap
          sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
        >
          {restaurantName}
          {/* {capitalCase(user?.restaurant?.role.replace(/_/g, ' '))} */}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
