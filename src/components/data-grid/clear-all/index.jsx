import { useURLPaginatorContext } from '#base/url-paginator/context';
import { Box, Button, styled } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalDataGridFilterContext } from '../filter/local-filter-context';

const StyledWrapper = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

const ClearAll = ({ hasFilters = false, onClick = () => {} }) => {
    return hasFilters ? (
        <StyledWrapper>
            <Button variant="text" onClick={onClick}>
                Clear all filters
            </Button>
        </StyledWrapper>
    ) : null;
};

export const ClearAllLocalFilters = () => {
    const { apiRef, hasFilters } = useLocalDataGridFilterContext();

    const clearAllFilters = () => {
        const newFilterModel = cloneDeep(
            apiRef.current.getFilterState(
                apiRef.current.state.filter.filterModel,
            ).filterModel,
        );

        newFilterModel.items = [];
        newFilterModel.quickFilterValues = [];

        apiRef.current.setFilterModel(newFilterModel);
    };

    if (!apiRef.current.getFilterState) return null;

    return <ClearAll hasFilters={hasFilters} onClick={clearAllFilters} />;
};

const ClearAllFilters = () => {
    const {
        paginatedQuery: { statefulURL },
    } = useURLPaginatorContext();

    const hasFilters = useMemo(() => {
        return statefulURL.hasFilters();
    }, [statefulURL.state]);

    const onClick = () => statefulURL.clearAll();

    return <ClearAll hasFilters={hasFilters} onClick={onClick} />;
};

export default ClearAllFilters;
