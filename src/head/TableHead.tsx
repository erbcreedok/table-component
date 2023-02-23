import React, { FC } from 'react';
import MuiTableHead from '@mui/material/TableHead';
import { TableHeadRow } from './TableHeadRow';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { TableInstance } from '..';

interface Props {
  table: TableInstance;
  virtualColumns?: VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
}

export const TableHead: FC<Props> = ({
  table,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
}) => {
  const {
    getHeaderGroups,
    getState,
    options: { enableStickyHeader, layoutMode, muiTableHeadProps },
  } = table;
  const { isFullScreen } = getState();

  const tableHeadProps =
    muiTableHeadProps instanceof Function
      ? muiTableHeadProps({ table })
      : muiTableHeadProps;

  const stickyHeader = enableStickyHeader || isFullScreen;

  return (
    <MuiTableHead
      {...tableHeadProps}
      sx={(theme) => ({
        display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
        opacity: 0.97,
        position: stickyHeader ? 'sticky' : 'relative',
        top: stickyHeader && layoutMode === 'grid' ? 0 : undefined,
        zIndex: stickyHeader ? 2 : undefined,
        ...(tableHeadProps?.sx instanceof Function
          ? tableHeadProps?.sx(theme)
          : (tableHeadProps?.sx as any)),
      })}
    >
      {getHeaderGroups().map((headerGroup) => (
        <TableHeadRow
          headerGroup={headerGroup as any}
          key={headerGroup.id}
          table={table}
          virtualColumns={virtualColumns}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
      ))}
    </MuiTableHead>
  );
};
