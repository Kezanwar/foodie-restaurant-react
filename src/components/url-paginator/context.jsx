import React, { createContext, useContext, useMemo } from 'react';

/****
 * @usage
    - @children -> React components that serve as children of this context provider,
      having access to the paginatedQuery context.
    - @paginatedQuery -> an object obtained from usePaginatedQuery hook, containing
      stateful URL management and control methods necessary for handling paginated data.
 * @behaviour
    - @URLPaginatorContextProvider -> Wraps its children in a ContextProvider, taking
      paginatedQuery as a prop (from usePaginatedQuery). It provides this paginatedQuery
      as the context value, enabling descendant components to control pagination and filtering
      functionality without direct prop drilling.
    - @useURLPaginatorContext -> A custom hook for consuming the URLPaginatorContext,
      allowing child components within the URLPaginatorContextProvider to access the
      current state and control methods of paginatedQuery.
****/

const URLPaginatorContext = createContext(null);

export const useURLPaginatorContext = () => {
    const ctx = useContext(URLPaginatorContext);
    if (!ctx) {
        throw new Error(
            'useURLPaginatorContext must be used inside URLPaginatorContextProvider',
        );
    }
    return ctx;
};

export const URLPaginatorContextProvider = ({
    children,
    paginatedQuery,
    filterOptions,
    alternativeContext = {},
}) => {
    const value = useMemo(() => {
        return { paginatedQuery, filterOptions, ...alternativeContext };
    }, [paginatedQuery, filterOptions]);
    return (
        <URLPaginatorContext.Provider value={value}>
            {children}
        </URLPaginatorContext.Provider>
    );
};
