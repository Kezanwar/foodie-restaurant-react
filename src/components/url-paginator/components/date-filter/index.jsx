import ToFromDateFilter from '#lib/components/to-from-date-filter';
import { useURLPaginatorContext } from '#base/url-paginator/context';

import { Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

const DateFilter = ({ onClose, width }) => {
    const {
        paginatedQuery: {
            statefulURL: { setFilter, state, clearFilter, navigate },
        },
    } = useURLPaginatorContext();

    const from = state['from'] ?? ''; //URLSearchParams returns null for non existent key
    const to = state['to'] ?? ''; //URLSearchParams returns null for non existent key

    const [localState, setLocalState] = useState({
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
    });

    const onFromChange = newValue => {
        setLocalState(prev => {
            return {
                from: newValue,
                to: prev.to,
            };
        });
    };

    const onToChange = newValue => {
        setLocalState(prev => {
            return {
                from: prev.from,
                to: newValue,
            };
        });
    };

    const onApply = () => {
        if (localState.from) {
            setFilter('from', localState.from.toISOString(), false);
        } else {
            clearFilter('from', false);
        }
        if (localState.to) {
            setFilter('to', localState.to.toISOString(), false);
        } else {
            clearFilter('to', false);
        }
        navigate();

        if (onClose) {
            onClose();
        }
    };

    const onClear = () => {
        setLocalState({
            from: undefined,
            to: undefined,
        });
        clearFilter('from', false);
        clearFilter('to');
        if (onClose) {
            onClose();
        }
    };

    return (
        <ToFromDateFilter
            width={width}
            localState={localState}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onClear={onClear}
            onApply={onApply}
        />
    );
};

export default DateFilter;
