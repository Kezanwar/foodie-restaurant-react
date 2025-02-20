import React, { useEffect, useState } from 'react';

import { IconButton, TextField } from '@mui/material';
import { ClearSharp } from '@mui/icons-material';
import { useURLPaginatorContext } from '#base/url-paginator/context';
import useDebounce from '#hooks/use-debounce';

/****
 * @usage
    - Must be rendered within URLPaginationContextProvider. Consumes URLPaginatorContext, Provides a text input for
    filtering data through a Stateful URL based on user input.
    - @filterKey -> The key for the desired URL Query Parameter e.g ?key=user_input
    - @placeholder -> The text shown when no value in the input
    - @disabled -> Prop to disable the input
 * @behaviour
    - Implements debounced input changes to minimize the impact on performance and API load by delaying state
    updates until the user has stopped typing for a specified duration.
    - Automatically disables itself under certain conditions (e.g., no results available and no current input text)
    to enhance user experience and interaction efficiency.
****/

const DebouncedInputFilter = ({
    filterKey,
    placeholder = '',
    disabled,
    limit = 100,
    size = 'small',
    startAdornment = undefined,
}) => {
    const {
        paginatedQuery: {
            statefulURL: { setFilter, state, clearFilter },
            paginator: { totalCount },
        },
    } = useURLPaginatorContext();
    const currentUrlValue = state[filterKey] ?? ''; //URLSearchParams returns null for non existent key

    const [text, setText] = useState(currentUrlValue);

    const debouncedText = useDebounce(text, 250);

    const onTextChange = e => {
        setText(String(e.target.value).slice(0, limit));
    };

    useEffect(() => {
        if (currentUrlValue !== text) {
            //need this check as line37 will cause this to run again

            setFilter(
                filterKey,
                debouncedText,
            ); /*this input can also be used to control an extra filter  */
        }
    }, [debouncedText]);

    useEffect(() => {
        //if user goes back or forward the url state changes need to update the local components
        if (currentUrlValue !== text) {
            setText(currentUrlValue);
        }
    }, [currentUrlValue]);

    return (
        <TextField
            value={text}
            autoFocus={false}
            onChange={onTextChange}
            inputMode="search"
            slotProps={{
                input: {
                    startAdornment,
                    endAdornment: text.length > 0 && (
                        <IconButton
                            onClick={() => {
                                clearFilter(filterKey);
                            }}
                        >
                            <ClearSharp fontSize={size} />
                        </IconButton>
                    ),
                },
            }}
            placeholder={placeholder}
            // disabled={disabled || (totalCount === 0 && !text)}
            disabled={disabled}
            size={size}
        />
    );
};

export default DebouncedInputFilter;
