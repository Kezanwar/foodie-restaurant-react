import { useCallback, useMemo, useRef, useState } from 'react';

import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import PropTypes from 'prop-types';
import useDropArea from 'react-use/lib/useDropArea';
import {
  Box,
  Stack,
  Button,
  IconButton,
  Typography,
  Modal,
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { UploadIllustration } from '../../assets/illustrations';
import Iconify from '../iconify';
import RejectionFiles from './errors/RejectionFiles';
import MultiFilePreview from './preview/MultiFilePreview';
import SingleFilePreview from './preview/SingleFilePreview';
import { MAX_IMAGE } from '../../constants/files.constants';
import useCustomMediaQueries from '../../hooks/useCustomMediaQueries';
import { CropModalContainer } from './styles';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72
  }
}));

// ----------------------------------------------------------------------

UploadWithCrop.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  files: PropTypes.array,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onUpload: PropTypes.func,
  thumbnail: PropTypes.bool,
  helperText: PropTypes.node,
  onRemoveAll: PropTypes.func,
  onRHFChange: PropTypes.func
};

const displayNone = { display: 'none' };

export default function UploadWithCrop({
  disabled,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  sx,
  onRHFChange
}) {
  const [fileRejections, setFileRejections] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [img, setImg] = useState('');

  const input = useRef(null);

  const hasFile = !!file;

  const isError = !!error;

  const [bond, state] = useDropArea({
    onFiles: (files) => {
      setImg(files[0]);
      setCropModalOpen(true);
    }
  });

  const handleOnClick = useCallback(() => {
    input.current.value = null;
    input.current.click();
  }, []);

  const handleOnChange = useCallback((e) => {
    setImg(e.target.files[0]);
    setCropModalOpen(true);
  }, []);

  const handlePreview = (file) => {
    onRHFChange(file);
    setCropModalOpen(false);
  };

  const handleCancelCrop = (file) => {
    input.current.value = null;
    setCropModalOpen(false);
  };

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <StyledDropZone
        {...bond}
        onClick={handleOnClick}
        sx={{
          ...(isError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light'
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none'
          }),
          ...(hasFile && {
            padding: '12% 0'
          })
        }}
      >
        <input
          onChange={handleOnChange}
          ref={input}
          type="file"
          accept="image/png, image/jpeg"
          style={displayNone}
        />

        <Placeholder
          sx={{
            ...(hasFile && {
              opacity: 0
            })
          }}
        />

        {hasFile && <SingleFilePreview file={file} />}
      </StyledDropZone>

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
            }
          }}
        >
          <Iconify icon="eva:close-fill" width={18} />
        </IconButton>
      )}

      {helperText && helperText}
      <CropModal
        onCancel={handleCancelCrop}
        isOpen={cropModalOpen}
        img={img}
        onCropDone={handlePreview}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

Placeholder.propTypes = {
  sx: PropTypes.object
};

function Placeholder({ sx, ...other }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row'
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left'
        },
        ...sx
      }}
      {...other}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography variant="body2" component="span">
          Click me or drag n drop to
        </Typography>{' '}
        <Typography
          variant="body2"
          component="span"
          sx={{
            color: 'primary.main'
          }}
        >
          uplaod a photo
        </Typography>
      </Box>
    </Stack>
  );
}

CropModal.propTypes = {
  isOpen: PropTypes.bool,
  img: PropTypes.string,
  onCropDone: PropTypes.func,
  onCancel: PropTypes.func
};

const modalStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

function CropModal({ isOpen, img, onCropDone, onCancel }) {
  const [loading, setLoading] = useState(true);
  const { isMobile } = useCustomMediaQueries();
  const cropperRef = useRef(null);

  const smallHeight = useMediaQuery('(max-height:770px)');
  const mediumHeight = useMediaQuery('(max-height:930px)');
  const largerHeight = useMediaQuery('(min-height:931px)');

  const canvasHeight = useMemo(() => {
    if (smallHeight) return 380;
    if (mediumHeight) return 500;
    if (largerHeight) return 600;
    return 400;
  }, [smallHeight, mediumHeight, largerHeight]);

  console.log(canvasHeight);

  const imgSrc = img ? URL.createObjectURL(img) : '';

  const handleOnDone = useCallback(async () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const croppedImg = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.9);
    const a = await fetch(croppedImg);
    const b = await a.blob();
    const file = new File([b], 'cover-photo', { type: b.type });
    onCropDone(file);
  }, []);

  return (
    <Modal sx={modalStyles} open={isOpen}>
      <CropModalContainer>
        <Box>
          <Typography mb={1} variant="h4">
            Crop your image
          </Typography>
          <Typography mb={1} variant="body2">
            Your image needs to fit our fixed crop ratio to fit nicely within
            the customer mobile app, use the tool below to choose the fit you
            would like.
          </Typography>
          <Typography mb={3} variant="body2">
            You can zoom in or out, move and resize the crop area to fit your
            desired position.
          </Typography>
        </Box>
        {loading && (
          <Skeleton
            variant="rounded"
            animation={'wave'}
            width={'100%'}
            height={500}
          />
        )}
        <Cropper
          src={imgSrc}
          // Cropper.js options
          background={false}
          initialAspectRatio={1}
          aspectRatio={1}
          height={canvasHeight}
          guides={false}
          ready={() => {
            setLoading(false);
          }}
          ref={cropperRef}
        />
        <Box mt={3} px={1} gap={4} display={'flex'} justifyContent={'center'}>
          <Button onClick={onCancel} variant="filled" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleOnDone} variant="contained" color="primary">
            Done
          </Button>
        </Box>
      </CropModalContainer>
    </Modal>
  );
}
