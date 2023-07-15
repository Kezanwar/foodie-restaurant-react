import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const DashboardTitleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));

export const DashboardStatGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr 1fr'
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr'
  }
}));
