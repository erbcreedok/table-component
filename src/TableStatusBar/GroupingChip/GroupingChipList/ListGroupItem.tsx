import { MenuItem, Typography } from '@mui/material'
import React, { DragEvent, FC, useRef, useState } from 'react'

import { GrabHandleButton } from '../../../buttons/GrabHandleButton'
import { IconsColor } from '../../../components/styles'
import { ItemBoxGroupingStyled } from '../GroupingChip.styled'

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
	const {
		options: {
			icons: { TrashIcon },
		},
	} = table
	const rowRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (event: DragEvent<any>) => {
		setIsDragging(true)

		iconButtonProps?.onDragStart?.(event)
		event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
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
					<TrashIcon onClick={handleDelete} htmlColor={IconsColor.default} />
				</div>
			</ItemBoxGroupingStyled>
		</MenuItem>
	)
}
