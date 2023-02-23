import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef,
} from '../../';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Sorting Examples',
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

export const SortingEnabledDefault: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} />
);

export const DisableSorting: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} enableSorting={false} />
);

export const DisableSortingForSpecificColumns: Story<
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
        enableSorting: false,
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
        enableSorting: false,
      },
    ]}
    data={data}
  />
);

export const DisableMultiSorting: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} enableMultiSort={false} />
);

export const SortRanking: Story<TableComponentProps> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'firstName',
        sortingFn: 'fuzzy',
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
    ]}
    data={data}
    enableRowNumbers
    initialState={{ sorting: [{ id: 'firstName', desc: false }] }}
  />
);
