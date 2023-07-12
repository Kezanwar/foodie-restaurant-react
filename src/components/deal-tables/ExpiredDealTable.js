/* eslint-disable object-shorthand */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { eachDayOfInterval, format } from 'date-fns';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery
} from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import AvTimerOutlinedIcon from '@mui/icons-material/AvTimerOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useExpiredDealsQuery from '../../hooks/queries/useExpiredDealsQuery';

import MotionDivViewport from '../animate/MotionDivViewport';
import DealTableEmpty from './DealTableEmpty';
import DealTableLoading from './DealTableLoading';
import { CustomHeaderCell } from './styles';
import Label from '../label/Label';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';

const menuIconProps = {
  fontSize: 'small',
  sx: { mr: 1 },
  color: 'primary'
};

const ActionMenu = React.memo(
  ({ dealId, handleView, handleEdit, handleExpire }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <div>
        <IconButton color="info" onClick={handleClick}>
          {/* {params.value} */}
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          // MenuListProps={{ sx: { minWidth: 120 } }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleView}>
            <VisibilityOutlinedIcon {...menuIconProps} /> View deal
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <DriveFileRenameOutlineOutlinedIcon {...menuIconProps} /> Create new
            from deal
          </MenuItem>
        </Menu>
      </div>
    );
  }
);

ExpiredDealTable.propTypes = {};

const TableSx = { width: '100%' };
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

const tableType = 'expired';

export default function ExpiredDealTable() {
  const dealQuery = useExpiredDealsQuery();
  const noFlex = useMediaQuery((theme) => theme.breakpoints.down(1400));
  // const showScroll = useMediaQuery((theme) => theme.breakpoints.down(1400));
  const { isMobile } = useCustomMediaQueries();
  const flex = noFlex ? 0 : 1;
  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        sortable: false,
        type: 'actions',

        renderCell: (params) => <ActionMenu />
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 220,
        flex: flex,

        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <DriveFileRenameOutlineOutlinedIcon color="primary" />
              {params.colDef.headerName}
            </CustomHeaderCell>
          );
        },
        renderCell: (params) => (
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {params.value}
          </Typography>
        )
      },
      {
        field: 'start_date',
        headerName: 'Start date',
        width: 160,
        type: 'date',
        renderCell: (params) => (
          <Typography>{format(params.value, 'dd/MM/yy')}</Typography>
        ),
        valueGetter: (params) => new Date(params.value),
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <DateRangeIcon color="primary" /> {params.colDef.headerName}
            </CustomHeaderCell>
          );
        }
      },
      {
        field: 'end_date',
        headerName: 'End date',
        type: 'date',
        width: 160,
        flex: flex,
        renderCell: (params) => (
          <Typography>{format(params.value, 'dd/MM/yy')}</Typography>
        ),
        valueGetter: (params) => new Date(params.value),
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <EventBusyIcon color="primary" /> {params.colDef.headerName}
            </CustomHeaderCell>
          );
        }
      },
      {
        field: 'days_active',
        headerName: 'Days active',
        type: 'number',
        flex: flex,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Label variant={'filled'} color={'success'}>
              {params.value}
            </Label>
          );
        },
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <AlarmOnOutlinedIcon color="primary" /> {params.colDef.headerName}
            </CustomHeaderCell>
          );
        },
        width: 150
      },

      {
        field: 'view_count',
        headerName: 'Views',
        type: 'number',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        flex: flex,
        renderCell: (params) => {
          const col = params.value <= 14 ? 'warning' : 'success';
          return (
            <Label variant={'filled'} color={col}>
              {params.value}
            </Label>
          );
        },
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <VisibilityOutlinedIcon color="primary" />{' '}
              {params.colDef.headerName}
            </CustomHeaderCell>
          );
        }
      },
      {
        field: 'impressions',
        headerName: 'Impressions',
        type: 'number',
        width: 180,
        flex: flex,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const col = params.value <= 6 ? 'warning' : 'success';
          return (
            <Label variant={'filled'} color={col}>
              {params.value}
            </Label>
          );
        },
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <InsightsOutlinedIcon color="primary" />{' '}
              {params.colDef.headerName}
            </CustomHeaderCell>
          );
        }
      },
      {
        field: 'save_count',
        headerName: 'Saves',
        type: 'number',
        width: 120,
        flex: flex,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const col = params.value <= 14 ? 'warning' : 'success';
          return (
            <Label variant={'filled'} color={col}>
              {params.value}
            </Label>
          );
        },
        renderHeader: (params) => {
          return (
            <CustomHeaderCell>
              <BookmarkAddedOutlinedIcon color="primary" />{' '}
              {params.colDef.headerName}
            </CustomHeaderCell>
          );
        }
      }
    ],
    [flex]
  );

  const deals = dealQuery?.data?.data;
  const loading = dealQuery?.isLoading;
  if (loading) return <DealTableLoading type={tableType} />;
  if (!deals?.length) return <DealTableEmpty type={tableType} />;
  return (
    <Box
      component={MotionDivViewport}
      initial={TableStartAnim}
      animate={TableEntranceAnim}
      sx={TableSx}
      transition={TableAnimDur}
    >
      <DataGrid
        components={{
          Toolbar: !isMobile ? GridToolbar : null
        }}
        rowSelection={false}
        rows={deals}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 8 }
          }
        }}
        pageSizeOptions={[8, 20]}
        onRowClick={(e, d) => console.log(e, d)}
      />
    </Box>
  );
}
