/* eslint-disable object-shorthand */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
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
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';
import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';
import { deleteDeal, expireDeal } from 'utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import { useSnackbar } from 'notistack';

const ActionContext = createContext(null);

const useActionContext = () => useContext(ActionContext);

const ActionContextProvider = ({ children }) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const [dealToExpireOpen, setDealToExpireOpen] = useState(false);
  const [dealToExpire, setDealToExpire] = useState(null);

  const onExpireDealCancel = useCallback(() => {
    setDealToExpireOpen(false);
    setTimeout(() => setDealToExpire(null), 200);
  }, []);

  const [dealToDeleteOpen, setDealToDeleteOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const onDeleteDealCancel = useCallback(() => {
    setDealToDeleteOpen(false);
    setTimeout(() => setDealToDelete(null), 200);
  }, []);

  const activeDeals = useActiveDealsQuery();
  const expiredDeals = useExpiredDealsQuery();
  const dash = useDashboardOverviewQuery();

  const { enqueueSnackbar } = useSnackbar();

  const handleOnExpireSubmit = useCallback(async () => {
    if (dealToExpire?._id) {
      setSubmitLoading(true);
      try {
        await expireDeal(dealToExpire?._id);
        activeDeals.refetch();
        expiredDeals.remove();
        dash.remove();
        mixpanelTrack(MIXPANEL_EVENTS.expire_deal_success);
        enqueueSnackbar(`Successfully expired ${dealToExpire.name}`, {
          variant: 'success'
        });
        onExpireDealCancel();
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        onExpireDealCancel();
        mixpanelTrack(MIXPANEL_EVENTS.expire_deal_error);
        enqueueSnackbar(
          `Unable to expire ${dealToExpire.name} please try again`,
          {
            variant: 'error'
          }
        );
      }
    }
  }, [dealToExpire]);

  const handleOnDeleteSubmit = useCallback(async () => {
    if (dealToDelete) {
      setSubmitLoading(true);
      try {
        await deleteDeal(dealToDelete._id);
        activeDeals.refetch();
        expiredDeals.remove();
        dash.remove();

        enqueueSnackbar(`Successfully deleted ${dealToDelete.name}`, {
          variant: 'success'
        });
        mixpanelTrack(MIXPANEL_EVENTS.delete_deal_success);
        onDeleteDealCancel();
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        onDeleteDealCancel();
        mixpanelTrack(MIXPANEL_EVENTS.delete_deal_error);
        enqueueSnackbar(
          `Unable to delete ${dealToDelete.name} please try again`,
          {
            variant: 'error'
          }
        );
      }
    }
  }, [dealToDelete]);

  const value = useMemo(() => {
    return {
      onExpireDealOpen: (deal) => {
        setDealToExpireOpen(true);
        setDealToExpire(deal);
      },
      onDeleteDealOpen: (deal) => {
        setDealToDeleteOpen(true);
        setDealToDelete(deal);
      }
    };
  }, []);

  return (
    <ActionContext.Provider value={value}>
      {children}
      <AcceptDeclineModal
        onCancel={onExpireDealCancel}
        onAccept={handleOnExpireSubmit}
        acceptText={'Yes, expire'}
        cancelText={'Cancel'}
        destructive
        submitLoading={submitLoading}
        title={`Expire ${dealToExpire?.name}`}
        subtitle={
          'Are you sure you want to expire this deal? Once expired the deal will no longer appear on users feed and will move over to your expired deals.'
        }
        isOpen={dealToExpireOpen}
      />
      <AcceptDeclineModal
        onCancel={onDeleteDealCancel}
        onAccept={handleOnDeleteSubmit}
        acceptText={'Yes, delete'}
        cancelText={'Cancel'}
        destructive
        submitLoading={submitLoading}
        title={`Delete ${dealToDelete?.name}`}
        subtitle={
          'Are you sure you want to delete this deal? This deal and its stats will be deleted forever.'
        }
        isOpen={dealToDeleteOpen}
      />
    </ActionContext.Provider>
  );
};

const tableType = 'active';

const ActionMenu = React.memo((params) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const nav = useNavigate();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { onExpireDealOpen, onDeleteDealOpen } = useActionContext();

  const onEdit = () => nav(`/dashboard/deals/edit/${params.row._id}`);

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
        {/* {isExpired && (
          <MenuItem
          // onClick={onUseAsTemplate}
          >
            <DriveFileRenameOutlineOutlinedIcon /> Use as template
          </MenuItem>
        )} */}

        <MenuItem onClick={onEdit}>
          <DriveFileRenameOutlineOutlinedIcon />
          Edit
        </MenuItem>

        <MenuItem onClick={() => onExpireDealOpen(params.row)}>
          <EventBusyIcon /> Expire
        </MenuItem>

        <MenuItem onClick={() => onDeleteDealOpen(params.row)}>
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
      return params.value &&
        new Date(params.value).toISOString() !== unixzeroiso ? (
        <Typography>{format(new Date(params.value), 'dd/MM/yy')}</Typography>
      ) : (
        'N/A'
      );
    },
    valueGetter: (params) => {
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
    <ActionContextProvider>
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
    </ActionContextProvider>
  );
}
