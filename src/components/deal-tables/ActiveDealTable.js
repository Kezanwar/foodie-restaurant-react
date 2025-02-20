/* eslint-disable object-shorthand */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import AvTimerOutlinedIcon from '@mui/icons-material/AvTimerOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MotionDivViewport from 'components/animate/MotionDivViewport';
import { CustomHeaderCell } from './styles';
import Label from 'components/label/Label';
import DealTableLoading from './DealTableLoading';
import DealTableEmpty from './DealTableEmpty';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import { PATH_DASHBOARD } from 'routes/paths';
import MenuPopover from 'components/menu-popover';
import LocalMobileCardsDataGrid from 'components/data-grid/mobile/local';
import MobileActionButton from 'components/data-grid/mobile/components/action-button';
import { MoreHoriz } from '@mui/icons-material';
import {
  DATA_GRID_COMPONENTS,
  PAGE_SIZE_OPTIONS
} from 'components/data-grid/constants';

const tableType = 'active';

const ActionMenu = React.memo((params) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log(event.currentTarget);
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isExpired = false;

  return (
    <>
      {params.isMobile ? (
        <MobileActionButton onClick={handleClick}>
          <MoreHoriz />
        </MobileActionButton>
      ) : (
        <IconButton onClick={handleClick}>
          {/* {params.value} */}
          <MoreVertOutlinedIcon fontSize="small" />
        </IconButton>
      )}

      <MenuPopover open={anchorEl} onClose={handleClose}>
        {isExpired && (
          <MenuItem
          // onClick={onUseAsTemplate}
          >
            <DriveFileRenameOutlineOutlinedIcon /> Use as template
          </MenuItem>
        )}
        {!isExpired && (
          <MenuItem
          // onClick={onEdit}
          >
            <DriveFileRenameOutlineOutlinedIcon />
            Edit
          </MenuItem>
        )}
        {!isExpired && (
          <MenuItem
          // onClick={onExpireOpen}
          >
            <EventBusyIcon /> Expire
          </MenuItem>
        )}
        <MenuItem
        // onClick={onDeleteOpen}
        >
          <DeleteOutlineIcon /> Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
});

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 220,
    flex: 1,

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
    field: 'end_date',
    headerName: 'End Date',
    align: 'right',
    headerAlign: 'right',
    width: 120,
    type: 'date',
    flex: 1,
    renderCell: (params) => {
      return params.value?.toISOString() !== unixzeroiso ? (
        <Typography>{format(new Date(params.value), 'dd/MM/yy')}</Typography>
      ) : (
        'N/A'
      );
    },
    valueGetter: (params) => {
      console.log(params);
      return !params.value ? unixzerodate : new Date(params.value); //no end date comes as null. to preserve table sorting we must set it to unix zero
    },
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
    headerName: 'Days Active',
    type: 'number',
    flex: 1,
    align: 'right',
    headerAlign: 'right',
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
    width: 160
  },
  {
    field: 'days_left',
    headerName: 'Days Left',
    type: 'number',
    flex: 1,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => {
      if (params.value === null) {
        return 'N/A';
      }
      const col =
        params.value <= 7
          ? 'error'
          : params.value <= 14
          ? 'warning'
          : 'success';
      return (
        <Label variant={'filled'} color={col}>
          {params.value}
        </Label>
      );
    },
    renderHeader: (params) => {
      return (
        <CustomHeaderCell>
          <AvTimerOutlinedIcon color="primary" /> {params.colDef.headerName}
        </CustomHeaderCell>
      );
    },
    width: 150
  },
  {
    field: 'views',
    headerName: 'Views',
    type: 'number',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    flex: 1,
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
          <VisibilityOutlinedIcon color="primary" /> {params.colDef.headerName}
        </CustomHeaderCell>
      );
    }
  },
  {
    field: 'favourites',
    headerName: 'Favourites',
    type: 'number',
    width: 120,
    flex: 1,
    align: 'right',
    headerAlign: 'right',
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
          <FavoriteBorderOutlinedIcon color="primary" />{' '}
          {params.colDef.headerName}
        </CustomHeaderCell>
      );
    }
  },
  {
    field: 'actions',
    type: 'actions',
    width: 42,
    getActions: (params) => [<ActionMenu {...params} />]
  }
];

const unixzeroiso = '1970-01-01T00:00:00.000Z';

const unixzerodate = new Date('1970-01-01T00:00:00.000Z');

const TableSx = { width: '100%' };
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

const getRowID = (r) => r._id;

export default function ActiveDealTable() {
  const dealQuery = useActiveDealsQuery();

  const navigate = useNavigate();

  const onRowClick = useCallback(
    (deal) => navigate(`${PATH_DASHBOARD.deals_single}/${deal.id}`),
    []
  );

  const { isTablet } = useCustomMediaQueries();

  const deals = dealQuery?.data?.data;
  const loading = dealQuery?.isLoading;

  if (loading) return <DealTableLoading type={tableType} />;
  if (!deals?.length) return <DealTableEmpty type={tableType} />;
  if (!deals) return null;

  return (
    <Box
      component={MotionDivViewport}
      initial={TableStartAnim}
      animate={TableEntranceAnim}
      sx={TableSx}
      transition={TableAnimDur}
    >
      {!isTablet ? (
        <DataGrid
          getRowId={getRowID}
          components={DATA_GRID_COMPONENTS}
          rowSelection={false}
          rows={deals}
          columns={columns}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onRowClick={onRowClick}
        />
      ) : (
        <LocalMobileCardsDataGrid
          getRowID={getRowID}
          onRowClick={onRowClick}
          rows={deals}
          columnDefinitions={columns}
        />
      )}
    </Box>
  );
}
