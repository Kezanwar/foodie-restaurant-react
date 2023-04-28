// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: '1rem',
          fontSize: '12px',
          backgroundColor: theme.palette.grey[isLight ? 800 : 700]
        },
        arrow: {
          color: theme.palette.grey[isLight ? 800 : 700]
        }
      }
    }
  };
}
