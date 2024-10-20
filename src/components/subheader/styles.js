import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const StyledSubheader = styled(Typography)(
  ({ theme, sx, mb = 2, fontWeight = 600 }) => ({
    fontSize: 12,
    // letterSpacing: 1.15,
    textTransform: 'uppercase',
    fontWeight,
    padding: 0,
    marginBottom: theme.spacing(mb),
    ...sx
  })
);
