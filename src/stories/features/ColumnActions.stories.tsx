import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'
import { getDefaultRowActionMenuItems } from '../utils/rowActionMenuItems'

const meta: Meta = {
	title: 'Features/Column Action Examples',
}

export default meta;

interface Row {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
}

const columns: Table_ColumnDef<Row>[] = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
  },
  {
    header: 'Address',
    accessorKey: 'address',
  },
  {
    header: 'State',
    accessorKey: 'state',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
  },
];

const data: Row[] = [...Array(100)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  state: faker.address.state(),
  phoneNumber: faker.phone.number(),
}));

export const ColumnActionsEnabledDefault: Story<
  TableComponentProps
> = () => <TableComponent columns={columns} data={data} renderRowActionMenuItems={getDefaultRowActionMenuItems()} enableRowActions />;

export const ColumnActionsDisabled: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableColumnActions={false}
  />
);

export const ColumnActionsDisabledPerColumn: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Address',
        accessorKey: 'address',
        enableColumnActions: false,
      },
      {
        header: 'State',
        accessorKey: 'state',
        enableColumnActions: false,
      },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
        enableColumnActions: false,
      },
    ]}
    data={data}
  />
);

export const ColumnActionsEnabledPerColumn: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Address',
        accessorKey: 'address',
        enableColumnActions: true,
      },
      {
        header: 'State',
        accessorKey: 'state',
        enableColumnActions: true,
      },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
      },
    ]}
    data={data}
    enableColumnActions={false}
  />
);
