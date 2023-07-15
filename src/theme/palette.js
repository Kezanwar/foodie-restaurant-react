import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  901: '#171a21'
};

const PRIMARY = {
  lighter: '#ffa66b',
  light: '#f27b44',
  main: '#f0692a',
  dark: '#ce5f2c',
  darker: '#c65c2b',
  contrastText: '#FFFFFF'
};

const SECONDARY = {
  lighter: '#fcf0ff',
  light: '#e7aaf6',
  main: '#d67ded',
  dark: '#c860e2',
  darker: '#a63ac1',
  contrastText: '#FFFFFF'
};

const INFO = {
  lighter: '#d5eeff',
  light: '#72c4ff',
  main: '#33aaff',
  dark: '#237ab8',
  darker: '#03375d',
  contrastText: '#fff'
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#fff'
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#cc800e',
  darker: '#7A4100',
  contrastText: GREY[800]
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#fc4d2e',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#fff'
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

export default function palette(themeMode) {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500]
    },
    background: {
      paper: '#fff',
      default: '#fff',
      neutral: GREY[200],
      paperOpposite: GREY[800]
    },
    action: {
      ...COMMON.action,
      active: GREY[600]
    }
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#fff',
      secondary: GREY[500],
      disabled: GREY[600]
    },
    background: {
      paper: GREY[800],
      paperOpposite: GREY[100],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16)
    },
    action: {
      ...COMMON.action,
      active: GREY[500]
    }
  };

  return themeMode === 'light' ? light : dark;
}
