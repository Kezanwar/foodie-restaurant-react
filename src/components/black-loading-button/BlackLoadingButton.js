import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material';

const BlackLoadingButton = styled(LoadingButton)(({ theme, disabled }) => ({
  backgroundColor: disabled ? theme.palette.grey[200] : theme.palette.grey[800],
  padding: theme.spacing(1),
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.grey['700']
    // color: theme.palette.primary.main
  }
}));

export default BlackLoadingButton;
