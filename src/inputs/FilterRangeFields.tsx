import React, { FC } from 'react';
import Box from '@mui/material/Box';
import { FilterTextField } from './FilterTextField';
import { Table_Header, TableInstance } from '..';

interface Props {
  header: Table_Header;
  table: TableInstance;
}

export const FilterRangeFields: FC<Props> = ({ header, table }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '1rem' }}>
      <FilterTextField header={header} rangeFilterIndex={0} table={table} />
      <FilterTextField header={header} rangeFilterIndex={1} table={table} />
    </Box>
  );
};
