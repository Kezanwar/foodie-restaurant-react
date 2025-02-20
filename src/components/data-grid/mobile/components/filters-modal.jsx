import React, { useMemo, useState } from 'react';
import {
    FilterComponent,
    FilterIcon,
    FilterTypes,
    getFilterTitlePreWord,
} from '#base/data-grid/filter/filter-component';
import { useURLPaginatorContext } from '#base/url-paginator/context';
import {
    Badge,
    Box,
    Button,
    ButtonBase,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    styled,
    Typography,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { parseListFilterToArray } from '#base/url-paginator/use-stateful-url';

const StyledChooseTitleBox = styled(Box)(({ theme }) => ({
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));

const StyledChooseFilterBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
}));

const StyledChooseFilterButtonBase = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'start',
    gap: theme.spacing(1),
    flex: 1,
    padding: theme.spacing(1),
}));

const StyledChooseFilterIconButton = styled(IconButton)(({ theme }) => ({
    marginLeft: 'auto',
    paddingRight: theme.spacing(1),
}));

const getListDisplayValues = (options, value) => {
    const values = parseListFilterToArray(value).map(v => {
        const opt = options.find(o => String(o.value) === v);
        if (opt.label) {
            if (opt.label.length > 10) {
                return `${opt.label.slice(0, 10)}...`;
            }
            return opt.label;
        }
        return false;
    });

    return values.filter(Boolean);
};

const ChooseFilterButton = ({
    options,
    statefulURL,
    headerName,
    mobileFilter,
    onEditFilter,
}) => {
    const { filterKey, filterType } = mobileFilter;

    const value = statefulURL.state[filterKey];

    const onClear = e => {
        e.stopPropagation();
        statefulURL.clearFilter(filterKey);
    };

    const handleSelectEditFilter = () =>
        onEditFilter({ ...mobileFilter, headerName });

    const isList = filterType === FilterTypes.TOGGLE_LIST;

    const displayValueComponent = useMemo(() => {
        if (isList && options?.length) {
            if (!value) {
                return (
                    <Typography variant="body2" color="text.primary">
                        All
                    </Typography>
                );
            }
            const listValues = getListDisplayValues(options, value);
            return listValues.length
                ? listValues.map(v => <Chip size="small" label={v} key={v} />)
                : null;
        }
        if (!value) {
            return null;
        }
        return (
            <Typography variant="body2" color="text.primary">
                {value}
            </Typography>
        );
    }, [isList, value, options]);

    return (
        <div>
            <StyledChooseTitleBox>
                <FilterIcon filterType={filterType} />
                <Typography variant="caption" color="text.secondary">
                    {headerName}
                </Typography>
            </StyledChooseTitleBox>

            <StyledChooseFilterBox>
                <StyledChooseFilterButtonBase onClick={handleSelectEditFilter}>
                    {displayValueComponent || (
                        <Typography variant="span" color="grey.400">
                            {isList ? 'Filter By' : 'Search by'} {headerName}
                        </Typography>
                    )}
                </StyledChooseFilterButtonBase>
                {value && (
                    <StyledChooseFilterIconButton
                        onClick={onClear}
                        size="small"
                    >
                        <Clear fontSize="small" />
                    </StyledChooseFilterIconButton>
                )}
            </StyledChooseFilterBox>
        </div>
    );
};

const ChooseFilters = ({
    filterableColumns,
    statefulURL,
    onEditFilter,
    filterOptions,
}) => {
    return (
        <Stack gap={2}>
            {filterableColumns.map(({ headerName, mobileFilter }) => (
                <ChooseFilterButton
                    options={filterOptions[mobileFilter.filterKey]}
                    onEditFilter={onEditFilter}
                    key={headerName}
                    statefulURL={statefulURL}
                    mobileFilter={mobileFilter}
                    headerName={headerName}
                />
            ))}
        </Stack>
    );
};

const EditFilter = ({ editFilter }) => {
    const { filterKey, filterType, headerName } = editFilter;

    const titlePreWord = getFilterTitlePreWord(filterType);

    const title = `${titlePreWord} ${headerName}`;

    return (
        <Stack>
            <Typography mb={1} color="text.secondary" variant="caption">
                {title}
            </Typography>
            <FilterComponent filterKey={filterKey} filterType={filterType} />
        </Stack>
    );
};

const FilterModal = ({ open, onClose, filterableColumns }) => {
    const {
        paginatedQuery: { statefulURL },
        filterOptions,
    } = useURLPaginatorContext();

    const [editFilter, setEditFilter] = useState(undefined);

    const onClearFilters = () => {
        statefulURL.clearFilter(
            filterableColumns.map(colDef => colDef.mobileFilter.filterKey),
        );
    };

    const onEditFilter = editFilter => {
        setEditFilter(editFilter);
    };

    const onGoBack = () => setEditFilter(undefined);

    return (
        <Dialog fullScreen onClose={onClose} open={open}>
            <DialogTitle mb={3}>Edit Filters</DialogTitle>
            <DialogContent>
                {editFilter ? (
                    <EditFilter editFilter={editFilter} />
                ) : (
                    <ChooseFilters
                        filterOptions={filterOptions}
                        onEditFilter={onEditFilter}
                        filterableColumns={filterableColumns}
                        statefulURL={statefulURL}
                    />
                )}
            </DialogContent>
            <DialogActions>
                {!editFilter && (
                    <Button onClick={onClearFilters} variant="text">
                        Clear Filters
                    </Button>
                )}
                <Button
                    onClick={editFilter ? onGoBack : onClose}
                    variant="contained"
                >
                    {editFilter ? 'Go Back' : 'Done'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterModal;
