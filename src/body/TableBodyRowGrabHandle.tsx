import { IconButtonProps } from '@mui/material/IconButton'
import React, {
	DragEvent,
	FC,
	RefObject,
	useCallback,
	useRef,
	useState,
} from 'react'

import { Table_Cell, TableInstance } from '..'
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
	const ghostRef = useRef<HTMLImageElement>()
	const {
		options: {
			muiTableBodyRowDragHandleProps,
			icons: { RowDragIcon },
			enableRowDragging,
			validateHoveredRow,
			handleRowsDrop,
		},
		getState,
	} = table
	const { row } = cell
	const { grouping, draggingRows } = getState()
	const [isDragging, setIsDragging] = useState(false)

	const iconButtonProps = {
		...(muiTableBodyRowDragHandleProps instanceof Function
			? muiTableBodyRowDragHandleProps({ row, table })
			: muiTableBodyRowDragHandleProps),
	}

	const dragListener = useCallback((event) => {
		if (dragRef.current) {
			dragRef.current.style.top = `${event.clientY}px`
			dragRef.current.style.left = `${event.clientX}px`
		}
	}, [])

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragStart?.(event)
		const selectedRows = table.getSelectedRowModel().flatRows
		const draggableRows =
			enableRowDragging instanceof Function
				? selectedRows.filter((row) => {
						const enabled = enableRowDragging(row)
						if (!enabled) {
							row.toggleSelected(false)
						}

						return enabled
				  })
				: selectedRows
		const draggingRows = draggableRows.length > 0 ? draggableRows : [row]
		ghostRef.current = document.createElement('img')
		ghostRef.current.src =
			'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
		ghostRef.current.style.position = 'absolute'
		ghostRef.current.style.cursor = 'grabbing'
		document.body.appendChild(ghostRef.current)
		event.dataTransfer.setDragImage(ghostRef.current, 0, 0)
		table.setDraggingRows(draggingRows)
		window.addEventListener('dragover', dragListener)
		setIsDragging(true)
	}

	const clearDrag = () => {
		table.setDraggingRows([])
		table.setHoveredRow(null)
		ghostRef.current?.remove()
		window.removeEventListener('dragover', dragListener)
		setIsDragging(false)
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		const { hoveredRow } = table.getState()

		if (
			hoveredRow &&
			(validateHoveredRow
				? validateHoveredRow(hoveredRow, table) !== true
				: false)
		) {
			clearDrag()

			return
		}

		handleRowsDrop?.({ hoveredRow, draggingRows, grouping, table })
		iconButtonProps?.onDragEnd?.(event)
		table.setRowSelection(() => ({}))
		table.setSorting(() => [])
		clearDrag()
	}

	return (
		<>
			<GrabHandleButton
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
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
