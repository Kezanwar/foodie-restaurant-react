import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import React from 'react';

const ConfirmAction = ({
    onClose,
    onConfirm,
    open,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed with this action?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmDisabled,
    confirmLoading,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {cancelText}
                </Button>
                <Button
                    disabled={confirmDisabled}
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                    endIcon={
                        confirmLoading ? (
                            <CircularProgress size={16} />
                        ) : undefined
                    }
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmAction;
