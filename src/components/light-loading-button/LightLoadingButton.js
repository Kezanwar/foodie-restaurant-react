import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material';

const LightLoadingButton = styled(LoadingButton)(({ theme, disabled, color }) =>
  disabled
    ? {
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5)
      }
    : {
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        backgroundColor:
          theme.palette.mode === 'light'
            ? alpha(theme.palette.primary.main, 0.15)
            : theme.palette.primary.main,
        color: theme.palette.mode === 'light' ? 'primary' : 'white',
        '.MuiLoadingButton-loadingIndicator': {
          color: theme.palette[color || 'primary'].main
        }
      }
);

export default LightLoadingButton;
