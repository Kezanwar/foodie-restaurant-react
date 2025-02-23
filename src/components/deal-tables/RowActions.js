/* eslint-disable object-shorthand */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router';
import { IconButton, MenuItem } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useActiveDealsQuery from 'hooks/queries/useActiveDealsQuery';
import MenuPopover from 'components/menu-popover';
import MobileActionButton from 'components/data-grid/mobile/components/action-button';
import { MoreHoriz } from '@mui/icons-material';
import AcceptDeclineModal from 'components/modals/accept-decline-modal/AcceptDeclineModal';
import useExpiredDealsQuery from 'hooks/queries/useExpiredDealsQuery';
import useDashboardOverviewQuery from 'hooks/queries/useDashboardOverviewQuery';
import { deleteDeal, expireDeal } from 'utils/api';
import { MIXPANEL_EVENTS, mixpanelTrack } from 'utils/mixpanel';
import { useSnackbar } from 'notistack';

const ActionContext = createContext(null);

export const useActionContext = () => useContext(ActionContext);

export const ActionContextProvider = ({ children }) => {
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

export const ActionMenu = React.memo((params) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const nav = useNavigate();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isExpired = params.row.is_expired;

  console.log(params.row);

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
          {!isExpired ? 'Edit' : 'Make Live'}
        </MenuItem>

        {!isExpired && (
          <MenuItem onClick={() => onExpireDealOpen(params.row)}>
            <EventBusyIcon /> Expire
          </MenuItem>
        )}

        <MenuItem onClick={() => onDeleteDealOpen(params.row)}>
          <DeleteOutlineIcon /> Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
});
