import React, { DragEvent, FC, RefObject } from 'react'

import { Table_Cell, TableInstance } from '..'
import { GrabHandleButton } from '../buttons/GrabHandleButton'

interface Props {
	cell: Table_Cell
	rowRef: RefObject<HTMLTableRowElement>
	table: TableInstance
}

export const TableBodyRowGrabHandle: FC<Props> = ({ cell, rowRef, table }) => {
	const {
		options: { muiTableBodyRowDragHandleProps },
	} = table
	const { row } = cell

	const iconButtonProps =
		muiTableBodyRowDragHandleProps instanceof Function
			? muiTableBodyRowDragHandleProps({ row, table })
			: muiTableBodyRowDragHandleProps

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragStart?.(event)
		event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
		table.setDraggingRow(row as any)
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragEnd?.(event)
		table.setDraggingRow(null)
		table.setHoveredRow(null)
	}

	return (
		<GrabHandleButton
			iconButtonProps={iconButtonProps}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			table={table}
		/>
	)
}
