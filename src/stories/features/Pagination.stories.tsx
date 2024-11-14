import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Features/Pagination Examples',
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
];
const data = [...Array(21)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number(80),
  address: faker.address.streetAddress(),
}));

export const PaginationEnabledDefault: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} enablePagination={true}/>
);

export const PaginationDisabledOrOverriden: Story<
  TableComponentProps
> = () => (
  <TableComponent columns={columns} data={data} enablePagination={false} />
);

export const PaginationPositionBottom: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    positionPagination="bottom"
  />
);

export const PaginationPositionTop: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} positionPagination="top" />
);

export const PaginationPositionTopAndBottom: Story<
  TableComponentProps
> = () => (
  <TableComponent columns={columns} data={data} positionPagination="both" />
);

export const PaginationPositionTopAndBottomNoInternalActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    positionPagination="both"
    enableToolbarInternalActions={false}
  />
);

export const CustomizePaginationComponents: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
    muiTablePaginationProps={{
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
      SelectProps: { native: true },
      labelRowsPerPage: 'Number of rows visible',
    }}
  />
);
