// @mui
import { useTheme } from '@emotion/react';
import { alpha, GlobalStyles as MUIGlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const theme = useTheme();

  const scrollBarStyles = {
    '&::-webkit-scrollbar': {
      width: 6,
      borderRadius: 5
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.grey[200]
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: alpha(theme.palette.primary.main, 0.75),
      borderRadius: 10
    }
  };
  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box'
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch'
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          ...scrollBarStyles
        },
        '#root': {
          width: '100%',
          height: '100%'
        },
        input: {
          ':-webkit-autofill': {
            '-webkit-transition-delay': '9999999s'
          },
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            }
          }
        },
        textArea: {
          ...scrollBarStyles
        },
        img: {
          display: 'block',
          maxWidth: '100%'
        },
        ul: {
          margin: 0,
          padding: 0
        },
        '.scroll-styles': {
          ...scrollBarStyles
        }
      }}
    />
  );

  return inputGlobalStyles;
}
