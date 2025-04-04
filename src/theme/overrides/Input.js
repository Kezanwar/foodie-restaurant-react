import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': {
              color: theme.palette.text.disabled
            }
          }
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: alpha(theme.palette.grey[500], 0.56)
          },
          '&:after': {
            borderBottomColor: theme.palette.text.primary
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.text.primary
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(
            theme.palette.grey[400],
            theme.palette.mode === 'light' ? 0.2 : 0.1
          ),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[400], 0.15)
          },
          '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.grey[400], 0.15)
          },
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.1)
          }
        },
        underline: {
          '&:before, :after': {
            display: 'none'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.grey[500], 0.32)
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1,
              borderColor: theme.palette.text.primary
            }
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground
            }
          }
        }
      }
    }
  };
}
