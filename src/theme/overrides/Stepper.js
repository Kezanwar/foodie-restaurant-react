// ----------------------------------------------------------------------

export default function Stepper(theme) {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            fill: theme.palette.success.main
          },
          '& .MuiStepIcon-text': {
            fontWeight: 700
          }
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        iconContainer: {
          [theme.breakpoints.down('md')]: {
            paddingRight: 0,
            marginBottom: 8,
            width: 'max-content'
          }
        },
        label: {
          [theme.breakpoints.down('md')]: {
            textAlign: 'center'
          },
          [theme.breakpoints.down('sm')]: {
            fontSize: 12
          }
        }
      }
    }
  };
}
