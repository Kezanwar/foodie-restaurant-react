import { Box, CircularProgress } from '@mui/material';

export const PlanLoading = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <CircularProgress size={24} />
    </Box>
  );
};
