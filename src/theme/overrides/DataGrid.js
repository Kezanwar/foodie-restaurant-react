// ----------------------------------------------------------------------

import { alpha } from '@mui/material';

export default function DataGrid(theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // borderRadius: 0,
          borderRadius: '8px',
          // paddingTop: 4,
          border: `none`,
          '& .MuiTablePagination-root': {
            borderTop: 0
          }
        },
        main: {
          // border: `1px solid ${theme.palette.divider}`
        },
        cell: {
          borderBottom: `0px solid ${theme.palette.divider}`,
          // borderLeft: `0.75px solid ${theme.palette.divider}`,
          '&:focus': {
            outline: 'none'
          },
          '&:focus-within': {
            outline: 'none'
          },
          '&:first-of-type': {
            borderLeft: `0px solid ${theme.palette.divider}`
          }
        },
        row: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:last-of-type': {
            borderBottom: `none`
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.lighter, 0.1),
            cursor: 'pointer'
          }
        },
        columnHeaders: {
          // border: `1.5px solid ${theme.palette.divider}`,
          // borderBottom: 'none',
          // borderRight: 'none',
          // borderTopLeftRadius: '8px',
          // borderTopRightRadius: '8px'
        },
        columnHeader: {
          '&:focus': {
            outline: 'none'
          },
          '&:focus-within': {
            outline: 'none'
          }
        },
        columnSeparator: {
          color: theme.palette.divider
        },
        toolbarContainer: {
          padding: theme.spacing(2),
          borderTopRightRadius: '8px',
          borderTopLeftRadius: '8px',
          backgroundColor: alpha(
            theme.palette.background.neutral,
            theme.palette.mode === 'light' ? 0.8 : 0.1
          ),
          '& .MuiButton-root': {
            marginRight: theme.spacing(1.5),
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }
        },
        paper: {
          boxShadow: theme.customShadows.dropdown
        },
        menu: {
          '& .MuiPaper-root': {
            boxShadow: theme.customShadows.dropdown
          },
          '& .MuiMenuItem-root': {
            ...theme.typography.body2,
            '& .MuiListItemIcon-root': {
              minWidth: 'auto'
            }
          }
        },
        footerContainer: {
          borderTop: `0px solid ${theme.palette.divider}`
        },
        panelFooter: {
          padding: theme.spacing(2),
          justifyContent: 'flex-end',
          borderTop: `0px solid ${theme.palette.divider}`,
          '& .MuiButton-root': {
            '&:first-of-type': {
              marginRight: theme.spacing(1.5),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            },
            '&:last-of-type': {
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }
          }
        },
        filterForm: {
          padding: theme.spacing(1.5, 0),
          '& .MuiFormControl-root': {
            margin: theme.spacing(0, 0.5)
          },
          '& .MuiInput-root': {
            marginTop: theme.spacing(3),
            '&::before, &::after': {
              display: 'none'
            },
            '& .MuiNativeSelect-select, .MuiInput-input': {
              ...theme.typography.body2,
              padding: theme.spacing(0.75, 1),
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.neutral
            },
            '& .MuiSvgIcon-root': {
              right: 4
            }
          }
        }
      }
    }
  };
}
