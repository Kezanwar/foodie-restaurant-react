import styled from '@emotion/styled';
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

export const DashedWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),

  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2)
}));
