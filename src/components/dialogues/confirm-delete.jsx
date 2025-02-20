import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

const ConfirmDelete = ({
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
    const [deleteText, setDeleteText] = useState('');
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                <Typography mt={2} mb={1} variant="body2">
                    Type the word{' '}
                    <Typography variant="span" fontStyle={'italic'}>
                        <strong>{'"delete"'}</strong>
                    </Typography>{' '}
                    in the box below to confirm
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    type="text"
                    color="text.secondary"
                    onChange={e => setDeleteText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {cancelText}
                </Button>
                <Button
                    disabled={deleteText !== 'delete' || confirmDisabled}
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                    endIcon={
                        confirmLoading ? (
                            <CircularProgress size={16} />
                        ) : (
                            undefined
                        )
                    }
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDelete;
