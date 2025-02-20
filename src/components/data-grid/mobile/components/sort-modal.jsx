import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    styled,
    TextField,
} from '@mui/material';
import { useURLPaginatorContext } from '#base/url-paginator/context';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
}));

const StyledContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

const direction_options = [
    { label: 'ASC', value: 'asc' },
    { label: 'DESC', value: 'desc' },
];

const SortModal = ({ open, onClose, sortOptions }) => {
    const {
        paginatedQuery: { statefulURL },
    } = useURLPaginatorContext();

    //take a local selection/combination first before submitting to URL / API
    const [localSelection, setLocalSelection] = useState({
        orderBy: statefulURL.state['orderby'],
        direction: statefulURL.state['direction'],
    });

    const onOrderByChange = (_, { props }) => {
        setLocalSelection(prev => {
            return { direction: prev.direction, orderBy: props.value };
        });
    };

    const onDirectionChange = (_, { props }) => {
        setLocalSelection(prev => {
            return { direction: props.value, orderBy: prev.orderBy };
        });
    };

    const onDone = () => {
        const { orderBy, direction } = localSelection;
        if (orderBy && direction) {
            statefulURL.sortBy(orderBy, direction);
        }
        onClose();
    };

    const onClear = () => {
        statefulURL.clearSort();
        setLocalSelection({
            orderBy: '',
            direction: '',
        });
    };

    const isDoneDisabled =
        (!localSelection.direction && localSelection.orderBy) ||
        (localSelection.direction && !localSelection.orderBy);

    return (
        <Dialog fullWidth onClose={onClose} open={open}>
            <DialogTitle>Sort</DialogTitle>
            <StyledDialogContent>
                <StyledContainer flex={1}>
                    <TextField
                        select
                        label="Order By"
                        onChange={onOrderByChange}
                        fullWidth
                        size="small"
                        value={localSelection.orderBy}
                    >
                        {sortOptions.map(({ label, value }) => (
                            <MenuItem value={value} key={label}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                </StyledContainer>
                <StyledContainer flex={0.6}>
                    <TextField
                        label={'Direction'}
                        select
                        fullWidth
                        size="small"
                        value={localSelection.direction}
                        onChange={onDirectionChange}
                    >
                        {direction_options.map(({ label, value }) => (
                            <MenuItem value={value} key={label}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                </StyledContainer>
            </StyledDialogContent>

            <DialogActions>
                <Button onClick={onClear} variant="text">
                    Clear Sort
                </Button>
                <Button
                    disabled={!!isDoneDisabled}
                    onClick={onDone}
                    variant="contained"
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SortModal;
