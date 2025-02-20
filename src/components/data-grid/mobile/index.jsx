import { Badge, Button, Stack, Typography } from '@mui/material';
import Row from './components/row';
import { useMemo, useState } from 'react';
import FiltersModal from './components/filters-modal';
import { useURLPaginatorContext } from '#base/url-paginator/context';
import { FilterList, Sort } from '@mui/icons-material';
import { StyledListActionsContainer } from './styles';
import SortModal from './components/sort-modal';
import Pagination from '#base/url-paginator/components/pagination';
import useToggle from '#hooks/use-toggle';

const MobileCardsDataGrid = ({
    columnDefinitions,
    rows,
    getRowID,
    onRowClick,
}) => {
    const [showFilters, openFilters, closeFilters] = useToggle();
    const [showSort, openSort, closeSort] = useToggle();

    const sortOptions = useMemo(() => {
        return columnDefinitions
            .filter(def => def.type !== 'actions' && def.sortable !== false)
            .map(def => ({ value: def.field, label: def.headerName }));
    }, [columnDefinitions]);

    const filterableColumns = useMemo(() => {
        return columnDefinitions.filter(def => !!def.mobileFilter);
    }, [columnDefinitions]);

    const canSort = !!sortOptions.length;

    const canFilter = !!filterableColumns.length;

    const {
        paginatedQuery: { statefulURL },
    } = useURLPaginatorContext();

    const isSortApplied = statefulURL.state['orderby'];

    const isFilterApplied = useMemo(() => {
        let hasFilters = false;
        //check if one of the filters is set
        for (let col of filterableColumns) {
            if (statefulURL.state[col.mobileFilter.filterKey]) {
                hasFilters = true;
                break;
            }
        }

        if (statefulURL.state['from'] && statefulURL.state['to']) {
            hasFilters = true;
        }

        return hasFilters;
    }, [filterableColumns, statefulURL.state]);

    const hasRows = rows.length > 0;

    return (
        <div>
            <StyledListActionsContainer>
                <div>
                    {canFilter && (
                        <>
                            <Button
                                startIcon={
                                    <Badge
                                        badgeContent={isFilterApplied ? 1 : 0}
                                        variant="dot"
                                        color="success"
                                    >
                                        <FilterList />
                                    </Badge>
                                }
                                onClick={openFilters}
                                variant="text"
                            >
                                Filters
                            </Button>
                            <FiltersModal
                                filterableColumns={filterableColumns}
                                open={showFilters}
                                onClose={closeFilters}
                            />
                        </>
                    )}
                </div>
                <div>
                    {canSort && (
                        <>
                            <Button
                                startIcon={
                                    <Badge
                                        badgeContent={isSortApplied ? 1 : 0}
                                        variant="dot"
                                        color="success"
                                    >
                                        <Sort />
                                    </Badge>
                                }
                                onClick={openSort}
                                variant="text"
                            >
                                Sort
                            </Button>
                            <SortModal
                                sortOptions={sortOptions}
                                open={showSort}
                                onClose={closeSort}
                            />
                        </>
                    )}
                </div>
            </StyledListActionsContainer>
            {hasRows > 0 && <Pagination />}
            <Stack my={2} gap={2}>
                {hasRows ? (
                    rows.map(row => (
                        <Row
                            onRowClick={onRowClick}
                            key={getRowID(row)}
                            getRowID={getRowID}
                            columnDefinitions={columnDefinitions}
                            row={row}
                        />
                    ))
                ) : (
                    <Typography
                        variant="body1"
                        textAlign={'center'}
                        color="grey.300"
                        mt={2}
                    >
                        No Rows{' '}
                    </Typography>
                )}
            </Stack>
            {hasRows > 0 && <Pagination />}
        </div>
    );
};

export default MobileCardsDataGrid;
