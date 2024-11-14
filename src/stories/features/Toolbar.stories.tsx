import { faker } from '@faker-js/faker'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, {
	FullScreenToggleButton,
	Table_ColumnDef,
	TableComponentProps,
} from '../../'

const meta: Meta = {
	title: 'Features/Toolbar Examples',
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
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
  },
];

const data = [...Array(5)].map(() => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number(80),
  address: faker.address.streetAddress(),
  phoneNumber: faker.phone.number(),
}));

export const ToolbarEnabledDefault: Story<TableComponentProps> = () => (
  <TableComponent columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    enableBottomToolbar={false}
  />
);

export const NoToolbars: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
    enableBottomToolbar={false}
  />
);

export const HideToolbarInternalActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    enableGrouping
    renderToolbarInternalActions={({ table }) => {
      return (
        <>
          <FullScreenToggleButton table={table} />
        </>
      );
    }}
  />
);

export const TableTitle: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <Typography variant="h4">Table Title</Typography>;
    }}
  />
);

export const CustomTopToolbarActions: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <Tooltip arrow title="Create New User">
            <IconButton onClick={handleCreateNewUser}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <Tooltip arrow title="Create New User">
            <IconButton onClick={handleCreateNewUser}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            color="error"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="contained"
          >
            Deactivate
          </Button>
          <Button
            color="success"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            variant="contained"
          >
            Activate
          </Button>
          <Button
            color="info"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            variant="contained"
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            color="error"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="contained"
          >
            Deactivate
          </Button>
          <Button
            color="success"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
            variant="contained"
          >
            Activate
          </Button>
          <Button
            color="info"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
            variant="contained"
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderTopToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <Tooltip arrow title="Create New User">
            <IconButton onClick={handleCreateNewUser}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Remove Users">
            <span>
              <IconButton
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom: Story<
  TableComponentProps
> = () => (
  <TableComponent
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderBottomToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <Tooltip arrow title="Create New User">
            <IconButton onClick={handleCreateNewUser}>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Remove Users">
            <span>
              <IconButton
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    renderTopToolbar={() => <Box sx={{ p: '2rem' }}>Custom Top Toolbar</Box>}
  />
);

export const renderCustomBottomToolbar: Story<TableComponentProps> = () => (
  <TableComponent
    columns={columns}
    data={data}
    renderBottomToolbar={() => (
      <Box sx={{ p: '2rem' }}>Custom Bottom Toolbar</Box>
    )}
  />
);
