import React, {
	Dispatch,
	DragEvent,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import { GrabHandleButton } from '../../buttons/GrabHandleButton'
import type { Table_Column, TableInstance } from '../../../../TableComponent'
import { Colors } from '../../../../components/styles'
import { DeleteIcon } from '../../icons/DeleteIcon'

interface Props<TData extends Record<string, any> = {}> {
	allColumns: Array<Table_Column<TData>>
	column: Table_Column<TData>
	hoveredColumn: Table_Column<TData> | null
	isSubMenu?: boolean
	setHoveredColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
	table: TableInstance<TData>
	enableDrag?: boolean
	onColumnVisibilityChange?(id: Table_Column<TData>, checked: boolean): void
	onColumnOrderChange(
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	): void
}

export const GroupingMenuItem = <TData extends Record<string, any> = {}>({
	hoveredColumn,
	setHoveredColumn,
	column,
	table,
	enableDrag,
	onColumnOrderChange,
}: Props<TData>) => {
	const { columnDef } = column

	const menuItemRef = useRef<HTMLElement>(null)

	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		setIsDragging(true)
		e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
	}

	const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
		setIsDragging(false)
		setHoveredColumn(null)
		if (hoveredColumn) {
			onColumnOrderChange(column, hoveredColumn)
		}
	}

	const handleDragEnter = (_e: DragEvent) => {
		if (!isDragging && columnDef.enableColumnOrdering) {
			setHoveredColumn(column)
		}
	}

	return (
		<>
			<MenuItem
				disableRipple
				ref={menuItemRef as any}
				onDragEnter={handleDragEnter}
				sx={(theme) => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					opacity: isDragging ? 0.5 : 1,
					outline: isDragging
						? `1px dashed ${theme.palette.divider}`
						: hoveredColumn?.id === column.id
						? `2px dashed ${theme.palette.primary.main}`
						: 'none',
					pl: `${(column.depth + 0.5) * 2}rem`,
					py: '6px',
					height: 48,
					'&:hover': {
						backgroundColor: 'unset',
						cursor: 'default',
					},
					'& button': {
						visibility: 'hidden',
						left: 4,
					},
					'&:hover button': {
						visibility: 'visible',
					},
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						alignItems: 'center',
						minWidth: '100%',
					}}
				>
					{enableDrag ? (
						<GrabHandleButton
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							table={table}
							iconButtonProps={{ sx: { transform: 'translateX(-11px)' } }}
						/>
					) : (
						<Box sx={{ width: '9px' }} />
					)}

					<Box
						sx={{
							border: `1px solid ${Colors.gray}`,
							borderRadius: '6px',
							height: 42,
							paddingLeft: '12px',
							boxSizing: 'border-box',
							display: 'flex',
							minWidth: '89%',
						}}
					>
						<Typography sx={{ alignSelf: 'center', fontSize: '14px' }}>
							{columnDef.header}
						</Typography>
					</Box>
					<IconButton disableRipple onClick={column.getToggleGroupingHandler()}>
						<DeleteIcon />
					</IconButton>
				</Box>
			</MenuItem>
		</>
	)
}
