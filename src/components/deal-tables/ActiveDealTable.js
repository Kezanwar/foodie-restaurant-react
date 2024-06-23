/* eslint-disable object-shorthand */
import React, { useMemo } from 'react';

import { useNavigate } from 'react-router';
import {
  Box,
  // IconButton,
  // MenuItem,
  // Menu,
  Typography,
  useMediaQuery
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';

import EventBusyIcon from '@mui/icons-material/EventBusy';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import AvTimerOutlinedIcon from '@mui/icons-material/AvTimerOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
// import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

// import MoreVertIcon from '@mui/icons-material/MoreVert';

import MotionDivViewport from 'components/animate/MotionDivViewport';
import { CustomHeaderCell } from './styles';
import Label from 'components/label/Label';

import DealTableLoading from './DealTableLoading';
import DealTableEmpty from './DealTableEmpty';

import useCustomMediaQueries from 'hooks/useCustomMediaQueries';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';

import { PATH_DASHBOARD } from 'routes/paths';

const tableType = 'active';

// const menuIconProps = {
//   fontSize: 'small',
//   sx: { mr: 1 },
//   color: 'primary'
// };

// const ActionMenu = React.memo(
//   ({ dealId, handleView, handleEdit, handleExpire }) => {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);
//     const handleClick = (event) => {
//       event.stopPropagation();
//       setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//       setAnchorEl(null);
//     };
//     return (
//       <div>
//         <IconButton color="info" onClick={handleClick}>
//           {/* {params.value} */}
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//         <Menu
//           // MenuListProps={{ sx: { minWidth: 120 } }}
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//         >
//           <MenuItem onClick={() => handleView(dealId)}>
//             <VisibilityOutlinedIcon {...menuIconProps} /> View deal
//           </MenuItem>
//           <MenuItem onClick={() => handleEdit(dealId)}>
//             <DriveFileRenameOutlineOutlinedIcon {...menuIconProps} /> Edit deal
//           </MenuItem>
//           <MenuItem onClick={() => handleExpire(dealId)}>
//             {' '}
//             <EventBusyIcon {...menuIconProps} /> Expire deal
//           </MenuItem>
//         </Menu>
//       </div>
//     );
//   }
// );

ActiveDealTable.propTypes = {};

const TableSx = { width: '100%' };
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

export default function ActiveDealTable() {
  const dealQuery = useActiveDealsQuery();
  const noFlex = useMediaQuery((theme) => theme.breakpoints.down(1400));
  // const showScroll = useMediaQuery((theme) => theme.breakpoints.down(1400));

  const navigate = useNavigate();

  const handleView = (dealId) =>
    navigate(`${PATH_DASHBOARD.deals_single}/${dealId}`);

  const { isMobile, isTablet } = useCustomMediaQueries();
  const flex = noFlex ? 0 : 1;
  const columns = useMemo(
    () => [
      // {
      //   field: 'actions',
      //   headerName: 'Actions',
      //   width: isTablet ? 80 : 100,
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
        field: 'end_date',
        headerName: 'End',
        align: 'right',
        headerAlign: 'right',
        type: 'date',
        width: 120,
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
        headerName: 'Days left',
        type: 'number',
        flex: flex,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => {
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
  if (!deals) return null;

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
        // sx={sx}
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
        onRowClick={(deal) => handleView(deal.id)}
      />
    </Box>
  );
}
