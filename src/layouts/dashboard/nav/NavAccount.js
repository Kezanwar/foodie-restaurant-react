import { capitalCase } from 'change-case';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// components
import { CustomAvatar } from '../../../components/custom-avatar';
import useRestaurantQuery from '../../../hooks/queries/useRestaurantQuery';
import useAuthStore from 'stores/auth';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.09)
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const user = useAuthStore((state) => state.user);

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
          {`${user?.first_name?.charAt(0)}. ${user?.last_name}`}
        </Typography>

        <Typography
          variant="body2"
          noWrap
          sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
        >
          {restaurantName}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
