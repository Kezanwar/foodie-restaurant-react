import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const ctx = createContext(null);

const LocalDataGridFilterContextProvider = ({
    apiRef,
    children,
    alternativeContext = {},
}) => {
    const [filteredColNames, setFilteredColNames] = useState([]);

    useEffect(() => {
        if (!apiRef.current) return;
        let unsubscribe;

        const handleFilterChange = () => {
            const filterModel = apiRef.current.getFilterState(
                apiRef.current.state.filter.filterModel,
            ).filterModel;
            const filteredColNames = filterModel.items
                .filter(item => !!item.value)
                .map(filteredCol => filteredCol.field);
            setFilteredColNames(filteredColNames);
        };

        const trySubscribe = () => {
            if (apiRef.current?.subscribeEvent) {
                unsubscribe = apiRef.current.subscribeEvent(
                    'filterModelChange',
                    handleFilterChange,
                );
            } else {
                setTimeout(trySubscribe, 200);
            }
        };

        trySubscribe();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [apiRef]);

    const value = useMemo(() => {
        return {
            filteredColNames,
            hasFilters: filteredColNames.length > 0,
            apiRef,
            ...alternativeContext,
        };
    }, [filteredColNames, apiRef]);

    return <ctx.Provider value={value}>{children}</ctx.Provider>;
};

export default LocalDataGridFilterContextProvider;

export const useLocalDataGridFilterContext = () => {
    return useContext(ctx);
};
