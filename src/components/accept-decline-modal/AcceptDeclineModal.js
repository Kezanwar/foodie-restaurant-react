import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Modal, Typography, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { TheatersOutlined } from '@mui/icons-material';

const AcceptDeclineModal = ({
  isOpen,
  onCancel,
  onAccept,
  title,
  subtitle,
  acceptText,
  submitLoading,
  cancelText,
  children
}) => {
  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      open={isOpen}
    >
      <Box
        px={2}
        py={2}
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          width: '480px',
          minHeight: '200px',
          maxWidth: '95vw',
          borderRadius: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          mb={0}
        >
          <Typography pl={1} variant="h5">
            {title}
          </Typography>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography pl={1} color={'grey'} variant="body2">
          {subtitle}
        </Typography>
        {children && (
          <Box px={1} mt={2}>
            {children}
          </Box>
        )}
        <Box mt={6} px={1} display={'flex'} justifyContent={'center'}>
          <Button
            onClick={onCancel}
            sx={{ flex: 1 }}
            variant="outlined"
            color="inherit"
          >
            {cancelText || 'Cancel'}
          </Button>
          <LoadingButton
            sx={{ ml: 3, flex: 1 }}
            loading={submitLoading}
            color="primary"
            onClick={onAccept}
            variant="contained"
          >
            {acceptText || 'Confirm'}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

AcceptDeclineModal.propTypes = {};

export default React.memo(AcceptDeclineModal);
