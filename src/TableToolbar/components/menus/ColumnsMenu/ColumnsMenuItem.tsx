import React, {
	Dispatch,
	DragEvent,
	PropsWithChildren,
	SetStateAction,
	useRef,
} from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { GrabHandleButton } from '../../buttons/GrabHandleButton'
import type {
	Table_Column,
	TableData,
	TableInstance,
	TooltipProps,
} from '../../../../index'
import { TableSwitch } from '../../../../components/TableSwitch'
import { Tooltip } from '../../../../components/Tooltip'
import { TreeAngle } from '../../../../components/TreeAngle'
import {
	Colors,
	DEFAULT_FONT_FAMILY,
	TextColor,
	IconsColor,
} from '../../../../components/styles'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { getPascalCase } from '../../../../utils/getPascalCase'

export interface ColumnsMenuItemProps<TData extends TableData = TableData> {
	column: Table_Column<TData>
	hoveredColumn?: Table_Column<TData> | null
	draggingColumn?: Table_Column<TData> | null
	setHoveredColumn?: Dispatch<SetStateAction<Table_Column<TData> | null>>
	setDraggingColumn?: Dispatch<SetStateAction<Table_Column<TData> | null>>
	table: TableInstance<TData>
	enableDrag?: boolean
	onColumnOrderChange?(
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	): void
	isLastInList?: boolean
	renderTreeAngle?: boolean
}

export const ColumnsMenuItem = <TData extends TableData = TableData>({
	hoveredColumn,
	draggingColumn,
	setHoveredColumn,
	setDraggingColumn,
	column,
	table,
	enableDrag,
	onColumnOrderChange,
	isLastInList,
	renderTreeAngle,
}: ColumnsMenuItemProps<TData>) => {
	const {
		options: {
			enableColumnOrdering,
			enableHiding,
			localization,
			icons: { GroupingIcon, LockedIcon, FreezeIcon },
		},
		getState,
	} = table

	const { columnDef } = column
	const { columnDefType } = columnDef

	const switchChecked =
		(columnDefType !== 'group' && column.getIsVisible()) ||
		(columnDefType === 'group' &&
			column.getLeafColumns().some((col) => col.getIsVisible()))

	const handleToggleColumnHidden = (col: Table_Column<TData>) => {
		if (columnDefType === 'group') {
			col?.columns?.forEach?.((childColumn: Table_Column<TData>) => {
				childColumn.toggleVisibility(!switchChecked)
			})
		} else {
			if (col.getIsGrouped()) {
				col.toggleGrouping()
			}
			if (col.getIsPinned()) {
				col.pin(false)
			}
			col.clearSorting()
			col.toggleVisibility()
		}
	}

	const menuItemRef = useRef<HTMLElement>(null)

	const isDragging = draggingColumn === column

	const columnOrderingEnabled =
		columnDef.enableColumnOrdering ?? enableColumnOrdering

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		setDraggingColumn?.(column)
		e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
	}

	const handleDragEnd = () => {
		setDraggingColumn?.(null)
		setHoveredColumn?.(null)
		if (hoveredColumn) {
			onColumnOrderChange?.(column, hoveredColumn)
		}
	}

	const handleDragEnter = () => {
		if (
			!isDragging &&
			columnOrderingEnabled &&
			column.getIsGrouped() === draggingColumn?.getIsGrouped() &&
			column.getIsPinned() === draggingColumn?.getIsPinned()
		) {
			setHoveredColumn?.(column)
		}
	}

	// for clearer indication of where dragging column is being placed
	const { columnOrder, grouping, columnPinning } = getState()

	const getBorderSx = () => {
		const isHovered = hoveredColumn?.id === column.id

		if (!draggingColumn || !isHovered) return {}
		const isGrouped = draggingColumn.getIsGrouped()
		const isPinned = draggingColumn.getIsPinned()

		const orderedColumns = isGrouped
			? grouping
			: isPinned
			? columnPinning[isPinned] ?? []
			: columnOrder

		const isDragginUpwards =
			orderedColumns.indexOf(draggingColumn.id) >
			orderedColumns.indexOf(hoveredColumn.id)

		const borderStyle = `1px solid ${Colors.LightBlue}`

		return {
			borderTop: isDragginUpwards ? borderStyle : 'none',
			borderBottom: !isDragginUpwards ? borderStyle : 'none',
		}
	}

	return (
		<>
			<MenuItem
				disableRipple
				ref={menuItemRef as any}
				onDragEnter={handleDragEnter}
				sx={() => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					opacity: 1,
					filter: isDragging
						? 'filter: drop-shadow(0px 4px 22px rgba(29, 30, 38, 0.15))'
						: 'none',
					...getBorderSx(),
					pl: `${(column.depth + 0.5) * 2}rem`,
					py: '6px',
					height: 36,
					'&:hover': {
						backgroundColor: 'unset',
					},
					'& button': {
						visibility: 'hidden',
					},
					'&:hover button': {
						visibility: 'visible',
					},
				})}
				onClick={withNativeEvent(
					{
						el: `ColumnsSettingsSidebar_${getPascalCase(
							column.columnDef.header
						)}_${switchChecked ? 'Hide' : 'Show'}`,
						type: 'click',
					},
					table
				)(() => null)}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						paddingLeft: '4px',
						alignItems: 'center',
						minWidth: 300,
					}}
				>
					{columnOrderingEnabled && switchChecked && enableDrag ? (
						<GrabHandleButton
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							iconButtonProps={{
								sx: { transform: 'translateX(-11px)', opacity: 1 },
							}}
						/>
					) : (
						<Box sx={{ width: '9px' }} />
					)}
					{renderTreeAngle && <TreeAngle lastInList={isLastInList} />}
					{enableHiding ? (
						<FormControlLabel
							componentsProps={{
								typography: {
									sx: {
										mb: 0,
										opacity: columnDefType !== 'display' ? 1 : 0.5,
										fontFamily: DEFAULT_FONT_FAMILY,
										fontSize: 14,
										lineHeight: '18px',
										paddingLeft: '12px',
										color: TextColor.Primary,
									},
								},
							}}
							checked={switchChecked}
							control={
								<Tooltip
									arrow
									enterDelay={1000}
									enterNextDelay={1000}
									title={localization.toggleVisibility}
								>
									<TableSwitch size="small" disableRipple />
								</Tooltip>
							}
							disabled={!column.getCanHide()}
							label={columnDef.header}
							onChange={() => handleToggleColumnHidden(column)}
						/>
					) : (
						<Typography sx={{ alignSelf: 'center' }}>
							{columnDef.header}
						</Typography>
					)}
					<Box sx={{ display: 'flex', ml: 'auto', gap: '9px' }}>
						{column.getIsPinned() && (
							<IconTooltip title={localization.frozen}>
								<FreezeIcon
									style={{
										width: '18px',
										height: '18px',
									}}
								/>
							</IconTooltip>
						)}
						{column.getIsGrouped() && (
							<IconTooltip title={localization.groupedBy}>
								<GroupingIcon
									style={{
										width: '18px',
										height: '18px',
									}}
								/>
							</IconTooltip>
						)}
						{!column.getCanHide() && (
							<IconTooltip title={localization.locked}>
								<LockedIcon />
							</IconTooltip>
						)}
					</Box>
				</Box>
			</MenuItem>
		</>
	)
}

const IconTooltip = ({
	children,
	...props
}: PropsWithChildren<TooltipProps>) => (
	<Tooltip
		{...props}
		placement="top"
		arrow
		sx={{ lineHeight: '18px', fontSize: 14, p: '6px 12px' }}
	>
		<Box sx={{ color: IconsColor.default }}>{children}</Box>
	</Tooltip>
)
