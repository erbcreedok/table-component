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
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { ColumnPinningButtons } from '../../../buttons/ColumnPinningButtons'
import { GrabHandleButton } from '../buttons/GrabHandleButton'
import type { Table_Column, TableInstance } from '../../../'
import { TableSwitch } from '../../../components/TableSwitch'
import { DEFAULT_FONT_FAMILY, Text } from '../../../components/styles'
import { LockIcon } from '../icons/LockIcon'

interface Props<TData extends Record<string, any> = {}> {
	allColumns: Table_Column<TData>[]
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
	allColumns,
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
			enableColumnOrdering,
			enableHiding,
			enablePinning,
			localization,
		},
	} = table

	const { columnDef } = column
	const { columnDefType } = columnDef

	const switchChecked =
		(columnDefType !== 'group' && column.getIsVisible()) ||
		(columnDefType === 'group' &&
			column.getLeafColumns().some((col) => col.getIsVisible()))

	const handleToggleColumnHidden = (column: Table_Column<TData>) => {
		if (columnDefType === 'group') {
			column?.columns?.forEach?.((childColumn: Table_Column<TData>) => {
				childColumn.toggleVisibility(!switchChecked)
				onColumnVisibilityChange(column, !switchChecked)
			})
		} else {
			column.toggleVisibility()
			onColumnVisibilityChange(column, !switchChecked)
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
		if (!isDragging && columnDef.enableColumnOrdering !== false) {
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
					{!isSubMenu &&
						columnDefType !== 'group' &&
						enableColumnOrdering &&
						!allColumns.some(
							(col) => col.columnDef.columnDefType === 'group'
						) &&
						(columnDef.enableColumnOrdering !== false &&
						switchChecked &&
						enableDrag ? (
							<GrabHandleButton
								onDragEnd={handleDragEnd}
								onDragStart={handleDragStart}
								table={table}
								iconButtonProps={{ sx: { transform: 'translateX(-11px)' } }}
							/>
						) : (
							<Box sx={{ width: '9px' }} />
						))}
					{!isSubMenu &&
						enablePinning &&
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
					{!column.getCanHide() && <LockIcon sx={{ marginLeft: 'auto' }} />}
				</Box>
			</MenuItem>
		</>
	)
}
