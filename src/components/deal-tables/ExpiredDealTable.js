import React, { useCallback } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { DataGrid } from '@mui/x-data-grid';
import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import { PATH_DASHBOARD } from 'routes/paths';
import MotionDivViewport from '../animate/MotionDivViewport';
import DealTableEmpty from './DealTableEmpty';
import DealTableLoading from './DealTableLoading';
import { CustomHeaderCell } from './styles';
import Label from 'components/label/Label';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import {
  DATA_GRID_COMPONENTS,
  PAGE_SIZE_OPTIONS
} from 'components/data-grid/constants';
import LocalMobileCardsDataGrid from 'components/data-grid/mobile/local';

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
    field: 'start_date',
    headerName: 'Start Date',
    align: 'right',
    headerAlign: 'right',
    width: 160,
    type: 'date',
    renderCell: (params) => (
      <Typography>{format(new Date(params.value), 'dd/MM/yy')}</Typography>
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
    headerName: 'End Date',
    type: 'date',
    width: 130,
    align: 'right',
    headerAlign: 'right',
    flex: 1,
    renderCell: (params) => (
      <Typography>{format(new Date(params.value), 'dd/MM/yy')}</Typography>
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
    headerName: 'Days Active',
    type: 'number',
    align: 'right',
    headerAlign: 'right',
    flex: 1,
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
  }
];

const TableSx = { width: '100%' };
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

const tableType = 'expired';

const getRowID = (r) => r._id;

export default function ExpiredDealTable() {
  const dealQuery = useExpiredDealsQuery();

  const { isTablet } = useCustomMediaQueries();

  const navigate = useNavigate();

  const onRowClick = useCallback(
    (deal) => navigate(`${PATH_DASHBOARD.deals_single}/${deal.id}`),
    []
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
      {!isTablet ? (
        <DataGrid
          components={DATA_GRID_COMPONENTS}
          rowSelection={false}
          rows={deals}
          columns={columns}
          getRowId={getRowID}
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
