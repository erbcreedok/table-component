import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import { ShowHideColumnsMenuItems } from './ShowHideColumnsMenuItems';
import { getDefaultColumnOrderIds } from '../column.utils';
import type { Table_Column, TableInstance } from '..';

interface Props<TData extends Record<string, any> = {}> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: TableInstance<TData>;
}

export const ShowHideColumnsMenu = <
  TData extends Record<string, any> = {},
>({
  anchorEl,
  isSubMenu,
  setAnchorEl,
  table,
}: Props<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    toggleAllColumnsVisible,
    options: {
      enableColumnOrdering,
      enableHiding,
      enablePinning,
      localization,
    },
  } = table;
  const { columnOrder, columnPinning } = getState();

  const hideAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(false));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as Table_Column<TData>[];

  const [hoveredColumn, setHoveredColumn] = useState<Table_Column<TData> | null>(
    null,
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isSubMenu ? 'center' : 'space-between',
          p: '0.5rem',
          pt: 0,
        }}
      >
        {!isSubMenu && enableHiding && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={hideAllColumns}
          >
            {localization.hideAll}
          </Button>
        )}
        {!isSubMenu && enableColumnOrdering && (
          <Button
            onClick={() =>
              table.setColumnOrder(
                getDefaultColumnOrderIds(table.options as any),
              )
            }
          >
            {localization.resetOrder}
          </Button>
        )}
        {!isSubMenu && enablePinning && (
          <Button
            disabled={!getIsSomeColumnsPinned()}
            onClick={() => table.resetColumnPinning(true)}
          >
            {localization.unpinAll}
          </Button>
        )}
        {enableHiding && (
          <Button
            disabled={getIsAllColumnsVisible()}
            onClick={() => toggleAllColumnsVisible(true)}
          >
            {localization.showAll}
          </Button>
        )}
      </Box>
      <Divider />
      {allColumns.map((column, index) => (
        <ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={column}
          hoveredColumn={hoveredColumn}
          isSubMenu={isSubMenu}
          key={`${index}-${column.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </Menu>
  );
};
