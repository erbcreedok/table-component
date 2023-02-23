import React, { DragEvent, FC, RefObject } from 'react';
import { GrabHandleButton } from '../buttons/GrabHandleButton';
import { reorderColumn } from '../column.utils';
import type { Table_Column, TableInstance } from '..';

interface Props {
  column: Table_Column;
  table: TableInstance;
  tableHeadCellRef: RefObject<HTMLTableCellElement>;
}

export const TableHeadCellGrabHandle: FC<Props> = ({
  column,
  table,
  tableHeadCellRef,
}) => {
  const {
    getState,
    options: { enableColumnOrdering, muiTableHeadCellDragHandleProps },
    setColumnOrder,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  const { columnDef } = column;
  const { hoveredColumn, draggingColumn, columnOrder } = getState();

  const mIconButtonProps =
    muiTableHeadCellDragHandleProps instanceof Function
      ? muiTableHeadCellDragHandleProps({ column, table })
      : muiTableHeadCellDragHandleProps;

  const mcIconButtonProps =
    columnDef.muiTableHeadCellDragHandleProps instanceof Function
      ? columnDef.muiTableHeadCellDragHandleProps({ column, table })
      : columnDef.muiTableHeadCellDragHandleProps;

  const iconButtonProps = {
    ...mIconButtonProps,
    ...mcIconButtonProps,
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragStart?.(event);
    setDraggingColumn(column);
    event.dataTransfer.setDragImage(
      tableHeadCellRef.current as HTMLElement,
      0,
      0,
    );
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragEnd?.(event);
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn?.id !== draggingColumn?.id
    ) {
      setColumnOrder(
        reorderColumn(column, hoveredColumn as Table_Column, columnOrder),
      );
    }
    setDraggingColumn(null);
    setHoveredColumn(null);
  };

  return (
    <GrabHandleButton
      iconButtonProps={iconButtonProps}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      table={table}
    />
  );
};
