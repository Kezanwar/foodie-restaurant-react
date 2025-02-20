import React, { useRef } from 'react';

import { Autocomplete, TextField } from '@mui/material';
import { useURLPaginatorContext } from '#base/url-paginator/context';

/****
 * @usage
    - Must be rendered within @URLPaginationContextProvider Consumes @URLPaginatorContext
    - Provides a dropdown select input allowing users to filter data through a Stateful
    URL based on provided options.
    - @filterKey -> The key for the desired URL Query Parameter e.g ?key=user_input
    - @options -> Array of options for the Select []{ label:string, value:string }
    - @placeholder -> Text shown in the label of the in-built Placeholder option
    - @disabled -> Prop to disable the input
****/

const fake_options = [
    {
        label: '1 option',
        value: '1',
    },
    {
        label: '2 option',
        value: '2',
    },
    {
        label: '3 option',
        value: '3',
    },
];

const isOptionEqualToValue = (opt, v) => opt.value === v;
const getOptionKey = opt => opt.label + opt.value;
const getOptionLabel = (value, options) => {
    if (!value) return '';
    return typeof value === 'object'
        ? value?.label
        : options.find(opt => opt.value === value)?.label || '';
};

const SelectFilter = ({
    filterKey,
    options = fake_options,
    disabled,
    placeholder = 'Filter by...',
    label = '',
    size = 'medium',
}) => {
    const {
        statefulURL: { state, setFilter },
    } = useURLPaginatorContext();

    const currentUrlValue = state[filterKey] ?? '';

    const onChange = (e, option) => {
        setFilter(filterKey, option?.value || '');
    };

    return (
        <Autocomplete
            disabled={disabled}
            options={options}
            value={currentUrlValue}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionKey={getOptionKey}
            getOptionLabel={value => getOptionLabel(value, options)}
            onChange={onChange}
            renderInput={params => (
                <TextField
                    placeholder={placeholder}
                    {...params}
                    label={label}
                    size={size}
                />
            )}
        />
    );
};

export default SelectFilter;
