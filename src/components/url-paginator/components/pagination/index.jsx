import React from 'react';
import { Box, Pagination as MUIPagination, styled } from '@mui/material';
import { useURLPaginatorContext } from '#base/url-paginator/context';

export const StyledWrapper = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
}));

const Pagination = () => {
    const { paginatedQuery } = useURLPaginatorContext();
    const { statefulURL, paginator } = paginatedQuery;

    return (
        <StyledWrapper>
            <MUIPagination
                onChange={(_, page) => statefulURL.setPage(page)}
                page={paginator.page}
                count={paginator.pageCount}
            />
        </StyledWrapper>
    );
};

export default Pagination;
