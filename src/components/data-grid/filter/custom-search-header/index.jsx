import React, { useState } from 'react';
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
import {
    FilterComponent,
    FilterIcon,
    FilterTypes,
    getFilterTitlePreWord,
} from '../filter-component';

const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
};

const CustomSearchHeader = ({ params, filterType, filterKey }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const closeMenu = () => setAnchorEl(null);
    const { colDef, field } = params;

    const {
        paginatedQuery: {
            statefulURL: { state },
        },
    } = useURLPaginatorContext();

    const hasValue =
        filterType === FilterTypes.DATE
            ? state['from'] || state['to']
            : state[filterKey];

    const titlePreWord = getFilterTitlePreWord(filterType);

    const title = `${titlePreWord} ${colDef.headerName}`;

    const onSearchClick = e => {
        e.stopPropagation();
        setAnchorEl(e.target);
    };

    const dateProps = { width: 230, onClose: closeMenu };

    const filterProps = filterType === FilterTypes.DATE ? dateProps : {};

    return (
        <Stack direction={'row'} alignItems={'center'} gap={1}>
            <GridColumnHeaderTitle
                description={colDef.description}
                columnWidth={colDef.width}
                label={colDef.headerName}
            />
            <Tooltip title={title}>
                <IconButton onClick={onSearchClick} size="small">
                    <Badge
                        variant="dot"
                        color="primary"
                        badgeContent={hasValue ? 1 : 0}
                    >
                        <FilterIcon filterType={filterType} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={closeMenu}
                anchorOrigin={anchorOrigin}
            >
                <Stack px={2} py={1}>
                    <Typography
                        mb={filterType === FilterTypes.DATE ? 1.5 : 1}
                        color="text.secondary"
                        variant="caption"
                    >
                        {title}
                    </Typography>
                    <FilterComponent
                        filterKey={filterKey}
                        filterType={filterType}
                        {...filterProps}
                    />
                </Stack>
            </Popover>
        </Stack>
    );
};

export default CustomSearchHeader;
