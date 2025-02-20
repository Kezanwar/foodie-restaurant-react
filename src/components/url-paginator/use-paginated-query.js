import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import useStatefulURL from './use-stateful-url';
import fetchAPI from '#util/fetch-api';

const ONE_MINUTE = 1000 * 60;

/****
 * @description
    - Integrates pagination logic with data fetching using react-query, building dynamic queries based on URL
    state managed by `useStatefulURL`.

 * @functionality
    - Combines URL state handling with data fetching, utilizing a base URL and optional filters
    to perform API requests. Caches and manages the lifecycle of fetched data to optimize rendering and data consistency.

 * @options
    - @baseUrl -> the baseUrl of the endpoint without any filtering applied.
    - @extraFilterKeys -> tacks on any extra filters to the use-stateful-url hook. {key, defaultValue?}
    - @cacheTime -> amount of time to cache a particular query, defaults to one minute

 * @behaviour
    - @statefulURL -> this is the return of use-stateful-url hook, this is the stateful URL
      and methods to control it, the hook uses the current resulting queryString from the
      stateful URL to fetch the filtered data and cache it in react query.
    - @query -> the useQuery hook from react-query, creates a hash using the baseUrl
      and paginator state thats used as a key for caching the results for that particular
      query.
    - @paginator -> this is the returned pagination metaData results from the API about
      the current returned query, includes metaData such as page, pageCount, totalCount, limit
****/

/** @typedef {Array<{key: string, defaultValue: string}> | undefined} ExtraFilterKeys */

/** @param {{baseUrl: string, cacheTime: number, uniqueKeyIdentifier: string, extraFilterKeys: ExtraFilterKeys }}  */
const usePaginatedQuery = ({
    pathName = '',
    baseUrl = '',
    extraFilterKeys = [],
    cacheTime = ONE_MINUTE,
    uniqueKeyIdentifier,
    onProcessFetchedData,
    enabled,
}) => {
    const statefulURL = useStatefulURL(extraFilterKeys, pathName);

    const queryString = statefulURL.getQueryString();

    let queryKey = [baseUrl, statefulURL.state];

    if (uniqueKeyIdentifier) {
        queryKey = queryKey.concat([uniqueKeyIdentifier]);
    }

    const query = useQuery({
        queryKey,
        queryFn: () =>
            fetchAPI({ url: `${baseUrl}?${queryString}` }).then(res => {
                if (onProcessFetchedData) {
                    const process = onProcessFetchedData(res);
                    return process;
                } else {
                    return res;
                }
            }),
        cacheTime: cacheTime,
        staleTime: cacheTime,
        retry: false,
        refetchOnWindowFocus: 'always',
        placeholderData: keepPreviousData,
        enabled: enabled !== undefined ? enabled : true,
    });

    const paginator = query?.data?.paginator || {};

    useEffect(() => {
        if (query.isFetched && paginator) {
            if (paginator.page !== 1 && paginator.page > paginator.pageCount) {
                statefulURL.replaceFilter('page', 1);
            }
        }
    }, [query.isFetched, paginator]);

    return {
        statefulURL,
        query,
        paginator,
        dataGridPaginationModel: paginator
            ? {
                  page: Number(statefulURL.state.page) - 1, //mui/datagrid is 0 based our API isnt
                  pageSize: Number(statefulURL.state.limit),
                  rowCount: paginator?.totalCount
                      ? Number(paginator.totalCount)
                      : 0,
                  hasNextPage: paginator?.page < paginator.pageCount,
              }
            : {},

        /* example of paginator
    {
        "page": 1,
        "limit": 2,
        "orderby": "name",
        "direction": "asc",
        "totalCount": 0,
        "pageCount": 0
    }
        */
    };
};

export default usePaginatedQuery;
