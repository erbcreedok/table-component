import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Styling/Table Alignment Examples',
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

export const DefaultLeft: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} />
);

export const CenterCells: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    muiTableHeadCellProps={{
      align: 'center',
    }}
    muiTableBodyCellProps={{
      align: 'center',
    }}
  />
);

export const CenterCellsWithGrabHandle: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableColumnDragging
    muiTableHeadCellProps={{
      align: 'center',
    }}
    muiTableBodyCellProps={{
      align: 'center',
    }}
  />
);

export const CenterCellsWithGrabHandleNoSorting: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableColumnDragging
    enableSorting={false}
    muiTableHeadCellProps={{
      align: 'center',
    }}
    muiTableBodyCellProps={{
      align: 'center',
    }}
  />
);

export const CenterCellsNoColumnActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableColumnActions={false}
    muiTableHeadCellProps={{
      align: 'center',
    }}
    muiTableBodyCellProps={{
      align: 'center',
    }}
  />
);

export const RightAlignNumberColumn: Story<TableComponentProps> = () => (
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
        header: 'Age',
        accessorKey: 'age',
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableHeadCellProps: {
          align: 'right',
        },
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
  />
);
