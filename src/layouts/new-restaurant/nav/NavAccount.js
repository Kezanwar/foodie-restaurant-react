// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../hooks/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  return (
    <StyledRoot>
      <CustomAvatar src={user?.photoURL} alt={user?.first_name} name={user?.first_name} />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="body1" noWrap>
          {`${user?.first_name} ${user?.last_name}`}
        </Typography>

        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {user?.restaurant?.role}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
