import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MotionDivViewport from 'components/animate/MotionDivViewport';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import { CustomHeaderCell } from 'components/deal-tables/styles';
import { formatInvoiceDate } from 'utils/formatTime';
import { StyledLabel } from 'components/plan-label';

const TableSx = {
  width: '100%',
  '.MuiDataGrid-row:hover': {
    backgroundColor: 'transparent!important',
    cursor: 'initial'
  }
};
const TableStartAnim = { opacity: 0 };
const TableEntranceAnim = { opacity: 1 };
const TableAnimDur = { duration: 0.3 };

const columns = [
  {
    field: 'period',
    headerName: 'Period',
    flex: 1,
    renderHeader: (params) => {
      return (
        <CustomHeaderCell>
          <EventNoteOutlinedIcon color="primary" />
          {params.colDef.headerName}
        </CustomHeaderCell>
      );
    },
    renderCell: (params) => (
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        {formatInvoiceDate(params.value.start)} -
        {formatInvoiceDate(params.value.end)}
      </Typography>
    )
  },
  {
    field: 'paid',
    headerName: 'Status',
    flex: 1,

    renderHeader: (params) => {
      return (
        <CustomHeaderCell>
          <PriceCheckOutlinedIcon color="primary" />
          {params.colDef.headerName}
        </CustomHeaderCell>
      );
    },
    renderCell: (params) => (
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        <StyledLabel color={params.value ? 'success' : 'error'}>
          {params.value ? 'Paid' : 'Not Paid'}
        </StyledLabel>
      </Typography>
    )
  },
  {
    field: 'total',
    headerName: 'Total',
    align: 'right',
    headerAlign: 'right',
    renderHeader: (params) => {
      return (
        <CustomHeaderCell>
          <FunctionsOutlinedIcon color="primary" />
          {params.colDef.headerName}
        </CustomHeaderCell>
      );
    },
    renderCell: (params) => (
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        £{(params.value / 100).toFixed(2)}
      </Typography>
    )
  },
  {
    field: 'url',
    headerName: 'PDF Link',
    width: 220,
    align: 'right',
    headerAlign: 'right',
    sortable: false,
    renderHeader: (params) => {
      return (
        <CustomHeaderCell>
          <DescriptionOutlinedIcon color="primary" />
          {params.colDef.headerName}
        </CustomHeaderCell>
      );
    },
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={() => window.open(params.value, '_blank')}
      >
        <LinkOutlinedIcon fontSize="small" color="info" />
      </IconButton>
    )
  }
];

export default function InvoicesTable({ invoices }) {
  return (
    <Box
      component={MotionDivViewport}
      initial={TableStartAnim}
      animate={TableEntranceAnim}
      sx={TableSx}
      transition={TableAnimDur}
    >
      <DataGrid
        getRowId={(row) => row.url}
        rowSelection={false}
        rows={invoices}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 8 }
          }
        }}
        pageSizeOptions={[8, 20]}
      />
    </Box>
  );
}
