import styled from '@emotion/styled';
import { ListSubheader, Typography } from '@mui/material';

export const StyledSubheader = styled(Typography)(({ theme, sx }) => ({
  fontSize: 12,
  letterSpacing: 0.75,
  textTransform: 'uppercase',
  fontWeight: '700',
  color: theme.palette.text.primary,
  ...sx
}));
