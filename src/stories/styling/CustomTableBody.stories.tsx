import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  Table_ColumnDef,
} from '../../';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Styling/Custom Table Body Examples',
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
  {
    header: 'State',
    accessorKey: 'state',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
  },
];

const data = [...Array(25)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number({ min: 20, max: 60 }),
  address: faker.address.streetAddress(),
  state: faker.address.state(),
  phoneNumber: faker.phone.number(),
}));

export const CustomTableBody: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    muiTableBodyProps={{
      children: 'Custom Table Body',
    }}
  />
);
