import React, { useEffect, useState } from 'react';
import {
    Badge,
    IconButton,
    Popover,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { GridColumnHeaderTitle } from '@mui/x-data-grid';

import { useURLPaginatorContext } from '#base/url-paginator/context';
import { FilterComponent, FilterIcon, FilterTypes } from '../filter-component';
import { useLocalDataGridFilterContext } from '../local-filter-context';

const LocalSearchHeader = ({ params, filterType, filterKey }) => {
    const { colDef } = params;

    const title = `Search by ${colDef.headerName}`;

    const { filteredColNames, apiRef } = useLocalDataGridFilterContext();

    const filterActive = filteredColNames.includes(filterKey);

    return (
        <Stack direction={'row'} alignItems={'center'} gap={1}>
            <GridColumnHeaderTitle
                description={colDef.description}
                columnWidth={colDef.width}
                label={colDef.headerName}
            />
            <Tooltip title={title}>
                <IconButton
                    onClick={e => {
                        e.stopPropagation();
                        apiRef.current?.showFilterPanel(filterKey);
                    }}
                    size="small"
                >
                    <Badge
                        variant="dot"
                        color="primary"
                        badgeContent={filterActive ? 1 : 0}
                    >
                        <FilterIcon filterType={filterType} />
                    </Badge>
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default LocalSearchHeader;
