import styled from '@emotion/styled';
import { ListSubheader, Typography } from '@mui/material';

export const StyledSubheader = styled(Typography)(({ theme, sx }) => ({
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: 0.75,
  fontWeight: '700',
  color: theme.palette.text.primary,
  ...sx
}));
