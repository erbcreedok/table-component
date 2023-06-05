import React, {
	Dispatch,
	DragEvent,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { ColumnPinningButtons } from '../../../../buttons/ColumnPinningButtons'
import { GrabHandleButton } from '../../buttons/GrabHandleButton'
import type { Table_Column, TableInstance } from '../../../../index'
import { TableSwitch } from '../../../../components/TableSwitch'
import { Tooltip } from '../../../../components/Tooltip'
import {
	Colors,
	DEFAULT_FONT_FAMILY,
	Text,
	IconsColor,
} from '../../../../components/styles'

interface Props<TData extends Record<string, any> = {}> {
	allColumns: Array<Table_Column<TData>>
	column: Table_Column<TData>
	hoveredColumn: Table_Column<TData> | null
	isSubMenu?: boolean
	setHoveredColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
	table: TableInstance<TData>
	enableDrag?: boolean
	onColumnVisibilityChange(id: Table_Column<TData>, checked: boolean): void
	onColumnOrderChange(
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	): void
}

export const SettingsMenuItem = <TData extends Record<string, any> = {}>({
	hoveredColumn,
	setHoveredColumn,
	column,
	isSubMenu,
	table,
	onColumnVisibilityChange,
	enableDrag,
	onColumnOrderChange,
}: Props<TData>) => {
	const {
		options: {
			enableHiding,
			enablePinning,
			localization,
			icons: { GroupingIcon, LockedIcon },
		},
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
				onColumnVisibilityChange(col, !switchChecked)
			})
		} else {
			if (col.getIsGrouped()) {
				col.toggleGrouping()
			}
			col.clearSorting()
			col.toggleVisibility()
			onColumnVisibilityChange(col, !switchChecked)
		}
	}

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
				sx={() => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					opacity: 1,
					filter: isDragging
						? 'filter: drop-shadow(0px 4px 22px rgba(29, 30, 38, 0.15))'
						: 'none',
					borderBottom:
						hoveredColumn?.id === column.id
							? `1px solid ${Colors.LightBlue}`
							: 'none',
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
					{columnDef.enableColumnOrdering && switchChecked && enableDrag ? (
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
					{enablePinning &&
						(column.getCanPin() ? (
							<ColumnPinningButtons column={column} table={table} />
						) : (
							<Box sx={{ width: '70px' }} />
						))}
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
										color: Text.Primary,
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
							disabled={(isSubMenu && switchChecked) || !column.getCanHide()}
							label={columnDef.header}
							onChange={() => handleToggleColumnHidden(column)}
						/>
					) : (
						<Typography sx={{ alignSelf: 'center' }}>
							{columnDef.header}
						</Typography>
					)}
					{!column.getCanHide() && (
						<Tooltip
							placement="top"
							title={localization.locked}
							arrow
							sx={{ height: '30px', mb: '2px' }}
						>
							<Box sx={{ marginLeft: 'auto' }}>
								<LockedIcon htmlColor={IconsColor.default} />
							</Box>
						</Tooltip>
					)}
					{column.getIsGrouped() && (
						<Tooltip
							placement="top"
							title={localization.groupedBy}
							arrow
							sx={{ height: '30px', mb: '2px' }}
						>
							<Box sx={{ marginLeft: 'auto' }}>
								<GroupingIcon />
							</Box>
						</Tooltip>
					)}
				</Box>
			</MenuItem>
		</>
	)
}
