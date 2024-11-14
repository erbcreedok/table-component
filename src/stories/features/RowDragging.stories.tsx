import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Features/Row Dragging Examples',
}

export default meta;

const columns: Table_ColumnDef<typeof initData[0]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
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
    header: 'Age',
    accessorKey: 'age',
  },
  {
    header: 'State',
    accessorKey: 'state',
  },
];

const initData = [...Array(25)].map(() => ({
  id: faker.random.alphaNumeric(6),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  age: faker.datatype.number(20) + 18,
  state: faker.address.state(),
}));

export const RowDraggingEnabled: Story<TableComponentProps> = () => {
  const [data, _setData] = React.useState(() => initData);

  return (
    <TableComponent
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
    />
  );
};
