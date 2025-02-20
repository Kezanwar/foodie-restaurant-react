import React, { useEffect, useState } from 'react';
import { useURLPaginatorContext } from '../context';
import { parseListFilterToArray } from '../use-stateful-url';

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

const list = ['harry', 'ron', 'snape', 'hermione', 'malfoy'];

const listToSelected = list => {
    return Object.fromEntries(list.map(tag => [tag, 1]));
};

const ExampleListToggle = ({ filterKey, options = list }) => {
    const {
        statefulURL: { setListFilter, state },
    } = useURLPaginatorContext();

    const current = state[filterKey]
        ? parseListFilterToArray(state[filterKey])
        : [];

    const [selected, setSelected] = useState(
        current ? listToSelected(current) : {},
        /* using a map instead of array in local state
        for quicker element finding */
    );

    const handleToggleSelect = tag => {
        if (selected[tag]) {
            setSelected(prev => {
                const n = { ...prev };
                delete n[tag];
                return n;
            });
        } else {
            setSelected(prev => {
                const n = { ...prev };
                n[tag] = 1;
                return n;
            });
        }
    };

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {options.map(tag => {
                return (
                    <button key={tag} onClick={() => handleToggleSelect(tag)}>
                        {tag} {selected[tag] ? '✅' : '😡'}
                    </button>
                );
            })}
        </div>
    );
};

export default ExampleListToggle;
