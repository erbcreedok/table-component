import React, { DragEvent, FC, useRef, useState } from 'react'
import { Box, MenuItem, Typography } from '@mui/material'

import { GrabHandleButton } from '../../../buttons/GrabHandleButton'
import { SortingItemBoxStyled } from '../SortingChip.styled'
import { SortingButtons } from '../../../TableToolbar/components/menus/SortingMenu/SortingButtons'
import { DeleteIcon } from '../../../icons/DeleteIcon'
import { useHoverEffects } from '../../../hooks/useHoverEffects'

interface ListItemSortProps {
	column: any
	table: any
	isDragable: boolean
	hoveredColumn: any
	setHoveredColumn: any
	onColumnOrderChanged: any
}

export const ListItemSort: FC<ListItemSortProps> = (props) => {
	const {
		column,
		table,
		hoveredColumn,
		isDragable,
		setHoveredColumn,
		onColumnOrderChanged,
	} = props

	const {
		options: { muiTableBodyRowDragHandleProps },
	} = table

	const rowRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const { hovered, hoverProps } = useHoverEffects()

	const handleDragStart = (event: DragEvent<any>) => {
		setIsDragging(true)

		muiTableBodyRowDragHandleProps?.onDragStart?.(event)
		event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
		table.setDraggingRow(rowRef as any)
	}

	const handleDragEnd = (event: DragEvent<any>) => {
		setIsDragging(false)

		muiTableBodyRowDragHandleProps?.onDragEnd?.(event)
		setHoveredColumn(null)

		if (hoveredColumn) {
			onColumnOrderChanged(column.columnDef, hoveredColumn)
		}
	}

	const handleDragEnter = (_e: DragEvent) => {
		if (!isDragging) {
			setHoveredColumn(column.columnDef)
		}
	}

	const handleDelete = () => {
		column.clearSorting()
	}

	return (
		<MenuItem
			disableRipple
			ref={rowRef as any}
			onDragEnter={handleDragEnter}
			sx={{ pl: 0 }}
			{...hoverProps}
		>
			<SortingItemBoxStyled component="div">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{isDragable && (
						<div style={{ marginRight: 18, marginLeft: 6 }}>
							<GrabHandleButton
								iconButtonProps={muiTableBodyRowDragHandleProps}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
								table={table}
							/>
						</div>
					)}

					<Typography variant="body2" style={{ fontSize: 14 }}>
						{column.columnDef.header}
					</Typography>
				</div>

				<Box sx={{ display: 'flex', marginRight: -5, alignItems: 'center' }}>
					<SortingButtons
						column={column}
						sx={{ marginRight: hovered ? '10px' : '20px' }}
						hideUnselected={!hovered}
					/>

					<Box
						sx={{
							display: hovered ? 'inline-block' : 'none',
							height: '20px',
							mr: '20px',
						}}
					>
						<DeleteIcon onClick={handleDelete} />
					</Box>
				</Box>
			</SortingItemBoxStyled>
		</MenuItem>
	)
}
