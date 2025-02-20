import ProtectedImage from '#base/images/protected-image';
import { CloseFullscreen } from '@mui/icons-material';
import { alpha, Box, IconButton, styled } from '@mui/material';
import React from 'react';

const StyledWrapper = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: alpha(theme.palette.grey[900], 0.95),
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 2000,
}));

const FloatingButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: theme.palette.common.white,
}));

const imgStyle = {
    height: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
};

const ImageLightBox = ({ imgSrc, open, handleClose, isProtected = false }) => {
    if (!open) return null;
    return (
        <StyledWrapper onClick={handleClose}>
            <FloatingButton>
                <CloseFullscreen />
            </FloatingButton>
            {isProtected ? (
                <ProtectedImage style={imgStyle} src={imgSrc} />
            ) : (
                <img src={imgSrc} style={imgStyle} />
            )}
        </StyledWrapper>
    );
};

export default ImageLightBox;
