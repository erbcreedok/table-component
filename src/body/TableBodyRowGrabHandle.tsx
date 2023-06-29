import { IconButtonProps } from '@mui/material/IconButton'
import React, { DragEvent, FC, RefObject, useRef, useState } from 'react'

import { Table_Cell, Table_Row, TableInstance } from '..'
import { GrabHandleButton } from '../buttons/GrabHandleButton'

import { TableRowDragGhost } from './TableRowDragGhost'

type Props = {
	cell: Table_Cell
	rowRef: RefObject<HTMLTableRowElement>
	table: TableInstance
	sx?: IconButtonProps['sx']
}

export const TableBodyRowGrabHandle: FC<Props> = ({
	cell,
	rowRef,
	table,
	sx,
}) => {
	const dragRef = useRef<HTMLDivElement>(null)
	const {
		options: {
			muiTableBodyRowDragHandleProps,
			icons: { RowDragIcon },
			enableRowOrdering,
			validateHoveredRow,
		},
	} = table
	const { row } = cell
	const [isDragging, setIsDragging] = useState(false)

	const iconButtonProps = {
		...(muiTableBodyRowDragHandleProps instanceof Function
			? muiTableBodyRowDragHandleProps({ row, table })
			: muiTableBodyRowDragHandleProps),
	}

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragStart?.(event)
		const selectedRows = table.getSelectedRowModel().flatRows
		const draggableRows =
			enableRowOrdering instanceof Function
				? selectedRows.filter((row) => {
						const enabled = enableRowOrdering(row)
						if (!enabled) {
							row.toggleSelected(false)
						}

						return enabled
				  })
				: selectedRows
		const draggingRows = draggableRows.length > 0 ? draggableRows : [row]
		const ghostImage = document.createElement('div')
		ghostImage.innerHTML = 'ghost'
		ghostImage.style.opacity = '0'
		document.body.appendChild(ghostImage)
		event.dataTransfer.setDragImage(ghostImage, 0, 0)
		table.setDraggingRows(draggingRows)
		setIsDragging(true)
		if (dragRef.current) {
			dragRef.current.style.visibility = 'visible'
		}
	}

	const clearDrag = () => {
		table.setDraggingRows([])
		table.setHoveredRow(null)
		if (dragRef.current) {
			dragRef.current.style.visibility = 'hidden'
		}
		setIsDragging(false)
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		const { hoveredRow } = table.getState()
		if (
			hoveredRow &&
			(validateHoveredRow
				? validateHoveredRow(hoveredRow as Table_Row, table) !== true
				: true)
		) {
			clearDrag()

			return
		}
		iconButtonProps?.onDragEnd?.(event)
		table.setRowSelection(() => ({}))
		table.setSorting(() => [])
		clearDrag()
	}

	const handleDrag = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDrag?.(event)
		if (dragRef.current) {
			dragRef.current.style.top = `${event.nativeEvent.y}px`
			dragRef.current.style.left = `${event.nativeEvent.x}px`
		}
	}

	return (
		<>
			<GrabHandleButton
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDrag={handleDrag}
				table={table}
				Icon={RowDragIcon}
				iconButtonProps={{
					sx: (theme) => ({
						zIndex: 2,
						...(iconButtonProps?.sx instanceof Function
							? iconButtonProps?.sx(theme)
							: (iconButtonProps?.sx as any)),
						...(sx instanceof Function ? sx(theme) : (sx as any)),
					}),
					...iconButtonProps,
				}}
			/>
			<TableRowDragGhost
				table={table}
				rowRef={rowRef}
				ref={dragRef}
				isDragging={isDragging}
			/>
		</>
	)
}
