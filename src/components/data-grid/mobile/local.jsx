import { Stack, Typography } from '@mui/material';
import Row from './components/row';

const LocalMobileCardsDataGrid = ({
  columnDefinitions,
  rows,
  getRowID,
  onRowClick
}) => {
  const hasRows = !!rows.length;
  return (
    <Stack gap={2}>
      {hasRows ? (
        rows.map((row) => (
          <Row
            onRowClick={onRowClick}
            key={getRowID(row)}
            getRowID={getRowID}
            columnDefinitions={columnDefinitions}
            row={row}
          />
        ))
      ) : (
        <Typography
          variant="body1"
          textAlign={'center'}
          color="grey.300"
          mt={2}
        >
          No Rows{' '}
        </Typography>
      )}
    </Stack>
  );
};

export default LocalMobileCardsDataGrid;
