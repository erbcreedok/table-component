import React, { DragEvent, FC, useRef, useState } from 'react'
import { Box, MenuItem, Typography } from '@mui/material'

import { GrabHandleButton } from '../../../buttons/GrabHandleButton'
import { SortingItemBoxStyled } from '../SortingChip.styled'
import { SortingButtons } from '../../../TableToolbar/components/menus/SortingMenu/SortingButtons'
import { IconsColor } from '../../../components/styles'
import { useHoverEffects } from '../../../hooks/useHoverEffects'
import { withNativeEvent } from '../../../utils/withNativeEvent'
import { getPascalCase } from '../../../utils/getPascalCase'

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
		options: {
			muiTableBodyRowDragHandleProps,
			icons: { TrashIcon },
		},
	} = table

	const rowRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const { hovered, hoverProps } = useHoverEffects()

	const handleDragStart = (event: DragEvent<any>) => {
		setIsDragging(true)

		muiTableBodyRowDragHandleProps?.onDragStart?.(event)
		event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
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
								analyticsElementName={`SortingChip_${getPascalCase(
									column.columnDef.header
								)}`}
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
						groupButtons
						hideUnselected={!hovered}
						isInChip
					/>

					<Box
						sx={{
							display: hovered ? 'inline-block' : 'none',
							height: '20px',
							mr: '20px',
						}}
					>
						<TrashIcon
							onClick={withNativeEvent(
								{
									el: `SortingChip_${getPascalCase(
										column.columnDef.header
									)}_Remove`,
									type: 'click',
								},
								table
							)(handleDelete)}
							htmlColor={IconsColor.default}
						/>
					</Box>
				</Box>
			</SortingItemBoxStyled>
		</MenuItem>
	)
}
