import React, {
	Dispatch,
	DragEvent,
	MouseEvent,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import type { Table_Column } from '../../../../'
import { ButtonLink } from '../../../../components/ButtonLink'
import { Colors, Text } from '../../../../components/styles'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { SortingButtons } from '../SortingMenu/SortingButtons'
import { GrabHandleButton } from '../../buttons/GrabHandleButton'

interface Props<TData extends Record<string, any> = {}> {
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
	onItemClick?(): void
}

export const SimpleMenuItem = <TData extends Record<string, any> = {}>({
	isSorting = false,
	isCompact = false,
	enableDrag = false,
	onItemClick,
	column,
	hoveredColumn,
	setHoveredColumn,
	onColumnOrderChange,
}: Props<TData>) => {
	const { columnDef } = column
	const menuItemRef = useRef<HTMLElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleItemClick = (e: MouseEvent<HTMLElement | HTMLButtonElement>) => {
		if (onItemClick) {
			onItemClick()
		}

		e.stopPropagation()
	}

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
			disableRipple={!onItemClick}
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
					backgroundColor: Colors.Lightgray,
				},
				'& button:active': {
					backgroundColor: Colors.gray,
				},
			})}
			onClick={handleItemClick}
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
					sx={{ alignSelf: 'center', fontSize: '14px', color: Text.Primary }}
				>
					{columnDef.header}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{isSorting ? (
						<>
							{isCompact ? (
								<SortingButtons column={column} sx={{ marginRight: '20px' }} />
							) : (
								<>
									<ButtonLink
										style={{ marginRight: '18px', fontWeight: 600 }}
										onClick={() => column.toggleSorting(false, true)}
									>
										Ascending +
									</ButtonLink>
									<ButtonLink
										onClick={() => column.toggleSorting(true, true)}
										style={{ fontWeight: 600 }}
									>
										Descending +
									</ButtonLink>
								</>
							)}
						</>
					) : (
						!isCompact && (
							<ButtonLink onClick={handleItemClick} style={{ fontWeight: 600 }}>
								Add Item +
							</ButtonLink>
						)
					)}
					{isCompact && (
						<IconButton
							disableRipple
							onClick={isSorting ? column.clearSorting : column.toggleGrouping}
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					)}
				</Box>
			</Box>
		</MenuItem>
	)
}
