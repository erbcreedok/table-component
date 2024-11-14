import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Features/Full Screen Examples',
}

export default meta;

const columns: Table_ColumnDef<typeof data[0]>[] = [
  {
    header: 'Employee',
    id: 'employee',
    columns: [
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
    ],
  },
  {
    header: 'Job Info',
    id: 'jobInfo',
    columns: [
      {
        header: 'Job Title',
        accessorKey: 'jobTitle',
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
      },
    ],
  },
];

const data = [...Array(128)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  jobTitle: faker.name.jobTitle(),
  salary: +faker.finance.amount(0, 150000, 0) + 20000,
  startDate: faker.date.past(8).toLocaleDateString(),
  signatureCatchPhrase: faker.company.catchPhrase(),
  avatar: faker.image.avatar(),
}));

export const FullScreenToggleEnabledDefault: Story<
  TableComponentProps
> = () => <TableComponent columns={columns} data={data} />;

export const DisableFullScreenToggle: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableFullScreenToggle={false}
  />
);

export const DefaultFullScreenOn: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    initialState={{ isFullScreen: true }}
  />
);

export const ControlledFullScreen: Story<TableComponentProps> = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <TableComponent
      columns={columns}
      data={data}
      onIsFullScreenChange={setIsFullScreen}
      state={{ isFullScreen }}
      muiTableBodyCellProps={({ cell }) => ({
        title: cell.getValue<string>(),
      })}
    />
  );
};
