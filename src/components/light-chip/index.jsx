import { alpha, Chip, styled } from '@mui/material';

const LightChip = styled(Chip)(({ theme, color = 'secondary' }) => ({
    'background': alpha(
        theme.palette[color].light,
        theme.palette.action.focusOpacity,
    ),
    '&.MuiChip-clickable:hover': {
        background: alpha(
            theme.palette[color].light,
            theme.palette.action.focusOpacity + 0.1,
        ),
    },
    'color': theme.palette[color].main,
    'fontWeight': theme.typography.fontWeightMedium,
    '.MuiChip-deleteIcon': {
        'fill': alpha(
            theme.palette[color].main,
            theme.palette.action.disabledOpacity,
        ),
        '&:hover': {
            fill: theme.palette[color].main,
        },
    },
}));

export default LightChip;
