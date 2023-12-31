import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef,
} from '../../';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Click to Copy Examples',
};

export default meta;

const columns: Table_ColumnDef<typeof data[0]>[] = [
  {
    header: 'First Name',
    accessorKey: 'name.firstName',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.lastName',
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
  name: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  },
  email: faker.internet.email(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
}));

export const ClickToCopyEnabled: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} enableClickToCopy />
);

export const ClickToCopyEnabledPerColumn: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'name.firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'name.lastName',
      },
      {
        header: 'Email Address',
        accessorKey: 'email',
        enableClickToCopy: true,
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
  />
);

export const ClickToCopyDisabledPerColumn: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={[
      {
        header: 'First Name',
        accessorKey: 'name.firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'name.lastName',
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
        enableClickToCopy: false,
      },
      {
        header: 'State',
        accessorKey: 'state',
        enableClickToCopy: false,
      },
    ]}
    data={data}
    enableClickToCopy
  />
);
