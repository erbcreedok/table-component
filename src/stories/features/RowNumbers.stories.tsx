import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef,
} from '../../';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Row Number Examples',
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

const data = [...Array(100)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  state: faker.address.state(),
  phoneNumber: faker.phone.number(),
}));

export const enableRowNumbersOriginal: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowNumbers
    rowNumberMode="original"
  />
);

export const enableRowNumbersStatic: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowVirtualization
    rowNumberMode="static"
  />
);

export const enableRowNumbersOriginalVirtual: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowNumbers
    enableBottomToolbar={false}
    rowNumberMode="original"
  />
);

export const enableRowNumbersStaticVirtual: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    enableBottomToolbar={false}
    rowNumberMode="static"
  />
);
