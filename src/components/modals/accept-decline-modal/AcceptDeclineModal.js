import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

const AcceptDeclineModal = ({
  isOpen,
  onCancel,
  onAccept,
  title,
  subtitle,
  acceptText,
  submitLoading,
  cancelText,
  children,
  destructive
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        {title}
        <DialogContentText mt={0.5}>{subtitle}</DialogContentText>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          {cancelText || 'Cancel'}
        </Button>
        <LoadingButton
          loading={submitLoading}
          color={destructive ? 'error' : 'primary'}
          onClick={onAccept}
          variant="contained"
        >
          {acceptText || 'Confirm'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

AcceptDeclineModal.propTypes = {};

export default React.memo(AcceptDeclineModal);
