import { alpha, Paper, Stack, styled, Box } from '@mui/material';

export const SetupFormWrapperStyled = styled(Paper)(({ theme }) => ({
  padding: `${theme.spacing(3)}`,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  minHeight: 120,
  [theme.breakpoints.down('md')]: {
    padding: `${theme.spacing(1)}`
  }
  // bgcolor: (theme) => alpha(theme.palette.grey[100], 0.0),
  //   border: `1px solid ${alpha(theme.palette.grey[600], 0.1)}`,
  //   boxShadow: theme.shadows[8],
}));

export const FormSectionStack = styled(Stack)(
  ({ sx, theme, singleItem, matchGapMB, fullWidthMobile }) => ({
    gap: theme.spacing(3),
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
    width: singleItem ? `calc(50% - ${theme.spacing(1.5)})` : '',
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(2),
      width:
        singleItem && fullWidthMobile
          ? '100%'
          : singleItem && !fullWidthMobile
          ? `calc(50% - ${theme.spacing(1)})`
          : ''
      // marginBottom: matchGapMB ? theme.spacing(2) : theme.spacing(5),
    },
    ...sx
  })
);

export const StoreNameAndUrlWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

export const InputWithInfoStack = styled(Stack, {
  shouldForwardProp: (p) => p !== 'reverseMob'
})(({ theme, reverseMob }) => ({
  marginBottom: theme.spacing(5),
  flexDirection: 'row',
  gap: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: reverseMob ? 'column-reverse' : 'column'
  }
}));

export const InputStack = styled(Stack)(({ theme, matchGapMB }) => ({
  marginBottom: matchGapMB ? theme.spacing(2) : theme.spacing(3),
  flexDirection: 'row',
  gap: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%'
  },
  '& > *': {
    flex: 1
  }
}));

export const InputStackSingleItemContainer = styled(Box)(({ theme }) => ({
  width: `calc(50% - ${theme.spacing(1.5)})`,
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));

export const StoreUrlContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  '& .MuiTextField-root': {
    flex: 1
  },
  [theme.breakpoints.down('md')]: {
    width: '100%'
    // marginBottom: theme.spacing(1),
  }
}));

export const InputWithInfoInputContainer = styled(Box)(({ theme }) => ({
  flex: 1
}));

export const InputWithInfoInfoContainer = styled(Box)(({ theme }) => ({
  flex: 1
}));

export const CanDisableInputContainer = styled(Box)(({ theme, disabled }) => ({
  filter: disabled ? 'greyscale(1.2)' : 'unset',
  pointerEvents: disabled ? 'none' : 'all'
}));

export const subheaderSx = { padding: 0, marginBottom: 16 };
