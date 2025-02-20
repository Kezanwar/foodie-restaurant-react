import { Box, Chip, styled } from '@mui/material';
import { useGridApiContext, useGridApiRef } from '@mui/x-data-grid';

import React from 'react';

const StyledChip = styled(Chip)(({ theme }) => ({
    maxWidth: 100,
    marginRight: theme.spacing(1),
}));

const StyledContainer = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
}));

const TableTagsDisplay = ({ params }) => {
    return (
        <StyledContainer>
            {params.value.map(p => (
                <StyledChip key={p.label} size="small" label={p.label} />
            ))}
        </StyledContainer>
    );
};

export default TableTagsDisplay;
