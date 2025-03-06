import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Stack,
  styled,
  Typography
} from '@mui/material';

const StyledCardActions = styled(CardActions)(() => ({
  display: 'flex',
  flexDirection: 'row'
}));

const DisplayColumn = ({ value, colDef, row }) => {
  if (colDef.type === 'actions') {
    /* actions are handled outside of here */
    return null;
  }

  const params = { value, row };

  let displayValue = colDef.valueGetter ? colDef.valueGetter(params) : value;

  if (colDef.renderCell) {
    displayValue = colDef.renderCell(params);
  }

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      gap={1.5}
    >
      <Typography color="text.secondary" component={'span'} variant="caption">
        {colDef.headerName}
      </Typography>
      {typeof displayValue === 'string' ? (
        <Typography component={'span'} variant="body2">
          {displayValue}
        </Typography>
      ) : (
        <Box>{displayValue}</Box>
      )}
    </Stack>
  );
};

const Actions = ({ row, actionsDef }) => {
  return (
    <StyledCardActions>
      {actionsDef.getActions({ row, isMobile: true })}
    </StyledCardActions>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px dashed ${theme.palette.grey[300]}`,
  boxShadow: 'none'
}));

const Row = ({ row, columnDefinitions, onRowClick, getRowID }) => {
  const actionsDef = useMemo(() => {
    return columnDefinitions.find(
      (def) => def.type === 'actions' || def.field === 'actions'
    );
  }, [columnDefinitions]);

  const handleClickRow = (e) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <StyledCard>
      <CardContent onClick={handleClickRow}>
        <Stack gap={2}>
          {columnDefinitions.map((colDef) => (
            <DisplayColumn
              key={colDef.field}
              value={row[colDef.field]}
              colDef={colDef}
              row={row}
            />
          ))}
        </Stack>
      </CardContent>
      {actionsDef && <Actions actionsDef={actionsDef} row={row} />}
    </StyledCard>
  );
};

export default Row;
