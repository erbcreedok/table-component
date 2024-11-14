import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Features/Column Pinning Examples',
}

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
    header: 'Email Address',
    accessorKey: 'email',
  },
  {
    header: 'Address',
    accessorKey: 'address',
  },
  {
    header: 'City',
    accessorKey: 'city',
  },
  {
    header: 'State',
    accessorKey: 'state',
  },
];

const data = [...Array(100)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
}));

export const ColumnPinningEnabled: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePinning
    enableColumnOrdering
    enableColumnDragging
  />
);

export const ColumnPinningInitial: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePinning
    enableColumnOrdering
    enableColumnDragging
    initialState={{ columnPinning: { left: ['email'], right: ['state'] } }}
  />
);

export const ColumnPinningDisabledPerColumn: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'firstName',
        enablePinning: false,
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Email Address',
        accessorKey: 'email',
      },
      {
        header: 'Address',
        accessorKey: 'address',
      },
      {
        header: 'City',
        accessorKey: 'city',
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
    ]}
    data={data}
    enablePinning
    enableColumnOrdering
    enableColumnDragging
  />
);

export const ColumnPinningWithSelect: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePinning
    enableColumnOrdering
    enableColumnDragging
    enableRowSelection
  />
);

export const ColumnPinningWithDetailPanel: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePinning
    enableColumnOrdering
    enableColumnDragging
    renderDetailPanel={({ row: _row }) => <h1>Hi</h1>}
  />
);
