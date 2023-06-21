import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import Image from 'mui-image';

import SuccessUndraw from '../../assets/undraw-sucess.svg';

const SuccessModal = ({
  isOpen,
  onThanksCTA,
  title,
  subtitle,
  ctaText,
  imgSrc = SuccessUndraw
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
          background: 'white',
          width: '480px',
          //   minHeight: '200px',
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
          mb={1}
        >
          <Typography pl={1} variant="h5">
            {title}
          </Typography>
          {/* <IconButton onClick={null}>
            <CloseIcon />
          </IconButton> */}
        </Box>
        <Typography pl={1} color={'grey'} variant="body2">
          {subtitle}
        </Typography>
        <Box mt={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image src={imgSrc} width={'120px'} />
        </Box>

        <Box mt={6} px={1} display={'flex'} justifyContent={'center'}>
          <Button
            onClick={onThanksCTA}
            sx={{ flex: 1 }}
            variant="contained"
            color="primary"
          >
            {ctaText || 'Ok'}
          </Button>
          {/* <LoadingButton
            sx={{ ml: 3, flex: 1 }}
            loading={submitLoading}
            color="primary"
            onClick={onAccept}
            variant="contained"
          >
            {acceptText || 'Confirm'}
          </LoadingButton> */}
        </Box>
      </Box>
    </Modal>
  );
};

SuccessModal.propTypes = {};

export default SuccessModal;
