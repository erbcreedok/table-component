import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef, utilColumns,
} from '../../'
import { faker } from '@faker-js/faker';
import { Button } from '@mui/material';

const meta: Meta = {
  title: 'Styling/Styling Display Columns',
};

export default meta;

const columns: Table_ColumnDef<typeof data[0]>[] = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
  },
  {
    header: 'Age',
    accessorKey: 'age',
  },
  {
    header: 'Address',
    accessorKey: 'address',
  },
];
const data = [...Array(21)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number(80),
  address: faker.address.streetAddress(),
}));

export const CustomizeDisplayColumns: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      [utilColumns.actions]: {
        muiTableHeadCellProps: {
          sx: {
            fontSize: '1.25rem',
            fontStyle: 'italic',
          },
        },
        size: 160,
      },
      [utilColumns.expand]: {
        size: 70,
        enableColumnActions: true,
        enableResizing: true,
      },
      [utilColumns.numbers]: {
        enableColumnOrdering: true,
        muiTableBodyCellProps: {
          sx: {
            color: 'red',
            fontSize: '1.5rem',
          },
        },
      },
    }}
    enableColumnOrdering
    enableColumnResizing
    enableRowNumbers
    enableRowSelection
    enableRowActions
    renderDetailPanel={() => <div>Detail Panel</div>}
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);
