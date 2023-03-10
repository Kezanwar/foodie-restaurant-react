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
  ({ sx, mobSx, theme, singleItem, matchGapMB, fullWidthMobile }) => ({
    gap: theme.spacing(3),
    flexDirection: 'row',
    marginBottom: matchGapMB ? theme.spacing(3) : theme.spacing(5),
    width: singleItem ? `calc(50% - ${theme.spacing(1.5)})` : '',
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(2),
      width:
        singleItem && fullWidthMobile
          ? '100%'
          : singleItem && !fullWidthMobile
          ? `calc(50% - ${theme.spacing(1)})`
          : '',
      marginBottom: matchGapMB ? theme.spacing(2) : theme.spacing(5),
      ...mobSx
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

export const InputWithInfoStack = styled(Stack)(({ theme, matchGapMB }) => ({
  marginBottom: matchGapMB ? theme.spacing(3) : theme.spacing(5),
  flexDirection: 'row',
  gap: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
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
