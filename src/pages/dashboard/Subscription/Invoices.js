import React from 'react';
import { Box, styled } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import useInvoicesQuery from 'hooks/queries/useInvoicesQuery';
import { DashedWrapper, PlanLoading } from './styles';
import InvoicesTable from 'components/invoices/InvoiceTable';
import Subheader from 'components/subheader/Subheader';

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
          <Subheader color={'text.secondary'} text={'Your Invoices'} mb={2} />

          <InvoicesTable invoices={data.data} />
        </DashedWrapper>
      )}
    </>
  );
};

export default Invoices;
