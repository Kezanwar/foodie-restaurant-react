import {
    GridColumnMenuHideItem,
    GridColumnMenuManageItem,
    GridColumnMenuSortItem,
} from '@mui/x-data-grid';
import React from 'react';
import { Divider, Stack } from '@mui/material';

function CustomColumnMenu(props) {
    return (
        <Stack width={260}>
            <GridColumnMenuSortItem {...props} />
            <Divider />
            <GridColumnMenuHideItem {...props} />
            <GridColumnMenuManageItem {...props} />
        </Stack>
    );
}

export default CustomColumnMenu;
