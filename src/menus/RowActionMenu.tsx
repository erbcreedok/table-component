import React, { FC, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  commonListItemStyles,
  commonMenuItemStyles,
} from './ColumnActionMenu';
import type { Table_Row, TableInstance } from '..';

interface Props {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: Table_Row;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: TableInstance;
}

export const RowActionMenu: FC<Props> = ({
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  table,
}) => {
  const {
    options: {
      icons: { EditIcon },
      enableEditing,
      localization,
      renderRowActionMenuItems,
    },
  } = table;

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      {enableEditing && (
        <MenuItem onClick={handleEdit} sx={commonMenuItemStyles}>
          <Box sx={commonListItemStyles}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            {localization.edit}
          </Box>
        </MenuItem>
      )}
      {renderRowActionMenuItems?.({
        row,
        table,
        closeMenu: () => setAnchorEl(null),
      })}
    </Menu>
  );
};
