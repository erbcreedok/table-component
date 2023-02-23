import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef,
} from '../../';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Header Groups Examples',
};

export default meta;

const columns: Table_ColumnDef<typeof data[0]>[] = [
  {
    header: 'Name',
    id: 'name',
    columns: [
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },

      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
    ],
  },
  {
    header: 'Info',
    id: 'info',
    columns: [
      {
        header: 'Age',
        accessorKey: 'age',
      },
      {
        header: 'Address',
        accessorKey: 'address',
      },
    ],
  },
];

const data = [...Array(55)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number(80),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
}));

export const HeaderGroups: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} />
);

export const HeaderGroupsWithStickyHeader: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const HeaderAndFooterGroups: Story<TableComponentProps> = () => (
  <TableComponent
    columns={[
      {
        header: 'Name',
        id: 'name',
        footer: 'Name',
        columns: [
          {
            header: 'First Name',
            footer: 'First Name',
            accessorKey: 'firstName',
          },
          {
            header: 'Last Name',
            footer: 'Last Name',
            accessorKey: 'lastName',
          },
        ],
      },
      {
        header: 'Info',
        id: 'info',
        footer: 'Info',
        columns: [
          {
            header: 'Age',
            footer: 'Age',
            accessorKey: 'age',
          },
          {
            header: 'Address',
            footer: 'Address',
            accessorKey: 'address',
          },
        ],
      },
    ]}
    data={data}
    enablePinning
  />
);

export const HeaderGroupsWithColumnOrdering: Story<
  TableComponentProps
> = () => (
  <TableComponent columns={columns} data={data} enableColumnOrdering />
);

export const HeaderGroupsWithColumnPinning: Story<
  TableComponentProps
> = () => <TableComponent columns={columns} data={data} enablePinning />;

export const HeaderGroupsWithColumResizing: Story<
  TableComponentProps
> = () => (
  <TableComponent columns={columns} data={data} enableColumnResizing />
);

export const MixedHeaderGroups: Story<TableComponentProps> = () => {
  return (
    <TableComponent
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
        {
          id: 'grouped',
          header: 'Grouped',
          columns: [
            {
              accessorKey: 'address',
              header: 'Address',
            },
          ],
        },
        {
          accessorKey: 'city',
          header: 'City',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
      ]}
      data={data}
    />
  );
};

export const DeepMixedHeaderGroups: Story<TableComponentProps> = () => {
  return (
    <TableComponent
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          id: 'grouped',
          header: 'Grouped',
          columns: [
            {
              header: 'Location',
              id: 'location',
              columns: [
                {
                  accessorKey: 'address',
                  header: 'Address',
                },
                {
                  accessorKey: 'city',
                  header: 'City',
                },
                {
                  accessorKey: 'state',
                  header: 'State',
                },
              ],
            },
          ],
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
      ]}
      data={data}
    />
  );
};
