import React, { FC, DragEvent, useRef, useState } from 'react'
import { MenuItem, Typography } from '@mui/material'

import { GrabHandleButton } from '../../../buttons/GrabHandleButton'
import { ItemBoxGroupingStyled } from '../GroupingChip.styled'
import { DeleteIcon } from '../../../icons/DeleteIcon'

export const ListGroupItem: FC<any> = ({
	title,
	table,
	column,
	iconButtonProps,
	hoveredColumn,
	setHoveredColumn,
	onColumnOrderChanged,
	columnDef,
}) => {
	const rowRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (event: DragEvent<any>) => {
		setIsDragging(true)

		iconButtonProps?.onDragStart?.(event)
		event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
		table.setDraggingRow(rowRef as any)
	}

	const handleDragEnd = (event: DragEvent<any>) => {
		setIsDragging(false)

		iconButtonProps?.onDragEnd?.(event)
		setHoveredColumn(null)

		if (hoveredColumn) {
			onColumnOrderChanged(columnDef, hoveredColumn)
		}
	}

	const handleDragEnter = (_e: DragEvent) => {
		if (!isDragging) {
			setHoveredColumn(columnDef)
		}
	}

	const handleDelete = () => {
		column.toggleGrouping()
	}

	return (
		<MenuItem disableRipple ref={rowRef as any} onDragEnter={handleDragEnter}>
			<ItemBoxGroupingStyled component="div">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ marginRight: 18, marginLeft: 6 }}>
						<GrabHandleButton
							iconButtonProps={iconButtonProps}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							table={table}
						/>
					</div>

					<Typography variant="body2" style={{ fontSize: 14 }}>
						{title}
					</Typography>
				</div>

				<div className="grouping-trash">
					<DeleteIcon onClick={handleDelete} />
				</div>
			</ItemBoxGroupingStyled>
		</MenuItem>
	)
}
