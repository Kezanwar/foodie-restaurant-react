/* eslint-disable object-shorthand */
import React, { useMemo } from 'react';

import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { Box, Typography, useMediaQuery } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import { PATH_DASHBOARD } from 'routes/paths';

import MotionDivViewport from '../animate/MotionDivViewport';
import DealTableEmpty from './DealTableEmpty';
import DealTableLoading from './DealTableLoading';
import { CustomHeaderCell } from './styles';
import Label from 'components/label/Label';
import useCustomMediaQueries from 'hooks/useCustomMediaQueries';

ExpiredDealTable.propTypes = {};

const TableSx = { width: '100%' };
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

const tableType = 'expired';

export default function ExpiredDealTable() {
  const dealQuery = useExpiredDealsQuery();
  const noFlex = useMediaQuery((theme) => theme.breakpoints.down(1400));
  const { isTablet } = useCustomMediaQueries();

  const navigate = useNavigate();

  const handleView = (dealId) =>
    navigate(`${PATH_DASHBOARD.deals_single}/${dealId}`);
  // const showScroll = useMediaQuery((theme) => theme.breakpoints.down(1400));
  const { isMobile } = useCustomMediaQueries();
  const flex = noFlex ? 0 : 1;
  const columns = useMemo(
    () => [
      // {
      //   field: 'actions',
      //   headerName: 'Actions',
      //   width: 100,
      //   sortable: false,
      //   type: 'actions',

      //   renderCell: (params) => (
      //     <ActionMenu dealId={params.id} handleView={handleView} />
      //   )
      // },
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
        headerName: 'Start',
        align: 'right',
        headerAlign: 'right',
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
        headerName: 'End',
        type: 'date',
        width: 130,
        align: 'right',
        headerAlign: 'right',
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
        headerName: 'Days Active',
        type: 'number',
        align: 'right',
        headerAlign: 'right',
        flex: flex,

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
      }
    ],
    [flex]
  );

  const desktopOnlyColumns = useMemo(() => {
    return !isTablet
      ? [
          {
            field: 'views',
            headerName: 'Views',
            type: 'number',
            width: 120,
            align: 'right',
            headerAlign: 'right',
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
            field: 'favourites',
            headerName: 'Favourites',
            type: 'number',
            width: 120,
            flex: flex,
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
                  <BookmarkAddedOutlinedIcon color="primary" />{' '}
                  {params.colDef.headerName}
                </CustomHeaderCell>
              );
            }
          }
        ]
      : [];
  }, [flex, isTablet]);

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
      {noFlex && (
        <Typography
          mb={1}
          fontSize={12}
          textAlign={'right'}
          color={'info.main'}
        >
          Scroll for more →
        </Typography>
      )}
      <DataGrid
        components={{
          Toolbar: !isMobile ? GridToolbar : null
        }}
        rowSelection={false}
        rows={deals}
        columns={columns.concat(desktopOnlyColumns)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 8 }
          }
        }}
        pageSizeOptions={[8, 20]}
        onRowClick={(e) => handleView(e.id)}
      />
    </Box>
  );
}
