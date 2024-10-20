import React from 'react';
import { Box, styled } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import useInvoicesQuery from 'hooks/queries/useInvoicesQuery';
import { PlanLoading } from './styles';
import InvoicesTable from 'components/invoices/InvoiceTable';
import Subheader from 'components/subheader/Subheader';

const DashedWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),

  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2)
}));

const Invoices = () => {
  const { data, isLoading } = useInvoicesQuery();

  return (
    <>
      <Helmet>
        <title> Invoices | Foodie</title>
      </Helmet>
      {isLoading ? (
        <PlanLoading />
      ) : (
        <DashedWrapper>
          <Subheader text={'Your Invoices'} mb={2} />

          <InvoicesTable invoices={data.data} />
        </DashedWrapper>
      )}
    </>
  );
};

export default Invoices;
