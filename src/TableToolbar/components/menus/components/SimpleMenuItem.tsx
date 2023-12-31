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

import type { Table_Column } from '../../../../'
import { Colors, TextColor } from '../../../../components/styles'
import { GrabHandleButton } from '../../buttons/GrabHandleButton'

export interface SimpleMenuItemProps<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	isSorting?: boolean
	isCompact?: boolean
	enableDrag?: boolean
	hoveredColumn: Table_Column<TData> | null
	setHoveredColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
	onColumnOrderChange(
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	): void
	children?: React.ReactNode
	disableRipple?: boolean
	onClick?: React.MouseEventHandler<HTMLElement>
}

export const SimpleMenuItem = <TData extends Record<string, any> = {}>({
	isSorting = false,
	isCompact = false,
	enableDrag = false,
	column,
	hoveredColumn,
	setHoveredColumn,
	onColumnOrderChange,
	children,
	disableRipple,
	onClick,
}: SimpleMenuItemProps<TData>) => {
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
		if (
			!isDragging &&
			(columnDef.enableColumnOrdering ||
				(isSorting && !columnDef.enableColumnOrdering))
		) {
			setHoveredColumn(column)
		}
	}

	return (
		<MenuItem
			disableRipple={enableDrag || disableRipple}
			onDragEnter={handleDragEnter}
			ref={menuItemRef as any}
			sx={() => ({
				alignItems: 'center',
				justifyContent: 'flex-start',
				height: 48,
				padding: '0 24px',
				margin: 0,
				opacity: 1,
				filter: isDragging
					? 'filter: drop-shadow(0px 4px 22px rgba(29, 30, 38, 0.15))'
					: 'none',
				borderBottom:
					hoveredColumn?.id === column.id
						? `1px solid ${Colors.LightBlue}`
						: 'none',
				'&:hover': {
					backgroundColor: isDragging ? '#fff' : '#F5F6FA',
				},
				'&:hover div div': {
					display: 'flex',
				},
				'&:hover > div > button': {
					display: 'block',
				},
				'& > div > button': {
					display: 'none',
				},
				'& button:hover': {
					borderRadius: '4px',
					backgroundColor: Colors.Gray20,
				},
				'& button:active': {
					backgroundColor: Colors.Gray,
				},
			})}
			onClick={onClick}
		>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					alignItems: 'center',
					width: '100%',
					'& div': {
						display: isCompact ? 'flex' : 'none',
						marginLeft: 'auto',
					},
				}}
			>
				{enableDrag && (
					<GrabHandleButton
						onDragEnd={handleDragEnd}
						onDragStart={handleDragStart}
						iconButtonProps={{
							sx: {
								transform: 'translateX(-15px)',
								position: 'absolute',
							},
						}}
					/>
				)}
				<Typography
					sx={{
						alignSelf: 'center',
						fontSize: '14px',
						color: TextColor.Primary,
					}}
				>
					{columnDef.header}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>
			</Box>
		</MenuItem>
	)
}
