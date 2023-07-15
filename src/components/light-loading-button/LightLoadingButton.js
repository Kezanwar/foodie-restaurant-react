import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material';

const LightLoadingButton = styled(LoadingButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.15)
      : theme.palette.primary.main,
  color: theme.palette.mode === 'light' ? 'primary' : 'white'
}));

export default LightLoadingButton;
