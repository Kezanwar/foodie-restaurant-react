import React, { useEffect, useMemo, useState } from 'react';
import { useURLPaginatorContext } from '#base/url-paginator/context';
import {
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Stack,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

/****
 * @usage
    - Must be rendered within @URLPaginationContextProvider Consumes @URLPaginatorContext
    - Serves as a demonstration component for developers,
    showing how to implement and manage a multi-value filter within URL state
    for a list of selectable options.
    - @filterKey => The key for the desired URL Query Parameter e.g ?key=list,of,comma,separated,selection
    - uses @setListFilter from @URLPaginatorContext which takes an Array and converts it into a comma separated string
 * @behaviour
    - Allows toggling selection of list items directly, updating the component's state and reflecting these changes in the URL to demonstrate the use of URL-based multi-value filters.
    - Implements effect hooks to sync local component state with URL state, ensuring that changes in
    URL state are accurately represented in the component and vice versa.
****/

const SHOW_SEARCH_LENGTH = 10;

const listToSelected = list => {
    return Object.fromEntries(list.map(tag => [tag, true]));
};

const StyledFormGroup = styled(Stack)(() => ({
    maxHeight: 300,
    overflowY: 'auto',
}));

const startAdornSx = { mr: 1 };

const ToggleListFilter = ({ filterKey }) => {
    const {
        paginatedQuery: {
            statefulURL: {
                setListFilter,
                clearFilter,
                state,
                parseListFilterToArray,
            },
        },
        filterOptions,
    } = useURLPaginatorContext();

    const [search, setSearch] = useState('');

    const options = useMemo(() => {
        return filterOptions[filterKey]
            ? filterOptions[filterKey].filter(opt =>
                  opt.label.toLowerCase().includes(search.toLowerCase()),
              )
            : [];
    }, [search, filterOptions[filterKey]]);

    const current = state[filterKey]
        ? parseListFilterToArray(state[filterKey])
        : [];

    const [selected, setSelected] = useState(
        current ? listToSelected(current) : {},
        /* using a map instead of array in local state
        for quicker element finding */
    );

    const handleToggleSelect = value => {
        if (selected[value]) {
            setSelected(prev => {
                const n = { ...prev };
                delete n[value];
                return n;
            });
        } else {
            setSelected(prev => {
                const n = { ...prev };
                n[value] = true;
                return n;
            });
        }
    };

    const clearFilters = () => clearFilter(filterKey);

    useEffect(() => {
        if (Object.keys(selected).length !== current.length) {
            setListFilter(filterKey, Object.keys(selected));
        }
    }, [selected]);

    useEffect(() => {
        const selectedLength = Object.keys(selected).length;
        if (current && selectedLength !== current.length) {
            setSelected(listToSelected(current));
        } else if (!current && selectedLength) {
            setSelected({});
        }
    }, [current.length]);

    const allSelected = useMemo(() => {
        return Object.keys(selected).length === 0;
    }, [selected]);

    return (
        <>
            <Stack gap={1}>
                {(options.length > SHOW_SEARCH_LENGTH || search) && (
                    <TextField
                        size="small"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <Search
                                        fontSize="small"
                                        sx={startAdornSx}
                                    />
                                ),
                                endAdornment: (
                                    <IconButton
                                        size="small"
                                        disabled={!search.length}
                                        onClick={() => setSearch('')}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                ),
                            },
                        }}
                    />
                )}
                <StyledFormGroup>
                    <FormControlLabel
                        key={'all'}
                        control={
                            <Checkbox
                                checked={allSelected}
                                size="small"
                                onClick={clearFilters}
                            />
                        }
                        label={
                            <Typography noWrap maxWidth={140} variant="body2">
                                All
                            </Typography>
                        }
                    />

                    {options.map(item => {
                        return (
                            <FormControlLabel
                                key={item.value}
                                control={
                                    <Checkbox
                                        checked={
                                            !!selected[item.value] ||
                                            allSelected
                                        }
                                        size="small"
                                        onClick={() =>
                                            handleToggleSelect(item.value)
                                        }
                                    />
                                }
                                label={
                                    <Typography
                                        noWrap
                                        maxWidth={140}
                                        variant="body2"
                                    >
                                        {item.label}
                                    </Typography>
                                }
                            />
                        );
                    })}
                </StyledFormGroup>
            </Stack>
            {current.length > 0 && (
                <Button onClick={clearFilters} variant="text" size="small">
                    Clear
                </Button>
            )}
        </>
    );
};

export default ToggleListFilter;
