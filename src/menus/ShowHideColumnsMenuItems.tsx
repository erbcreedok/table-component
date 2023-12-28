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
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { ColumnPinningButtons } from '../buttons/ColumnPinningButtons'
import { GrabHandleButton } from '../buttons/GrabHandleButton'
import { reorderColumn } from '../column.utils'
import type { Table_Column, TableInstance } from '..'
import { getValidColumnOrder } from '../utils/getValidColumnOrder'

interface Props<TData extends Record<string, any> = {}> {
	allColumns: Table_Column<TData>[]
	column: Table_Column<TData>
	hoveredColumn: Table_Column<TData> | null
	isSubMenu?: boolean
	setHoveredColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
	table: TableInstance<TData>
}

export const ShowHideColumnsMenuItems = <
	TData extends Record<string, any> = {}
>({
	allColumns,
	hoveredColumn,
	setHoveredColumn,
	column,
	isSubMenu,
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			enableColumnOrdering,
			enableHiding,
			enablePinning,
			localization,
		},
		setColumnOrder,
	} = table
	const { columnOrder } = getState()
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
			})
		} else {
			column.toggleVisibility()
		}
	}

	const menuItemRef = useRef<HTMLElement>(null)

	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		setIsDragging(true)
		e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
	}

	const handleDragEnd = () => {
		setIsDragging(false)
		setHoveredColumn(null)
		if (hoveredColumn) {
			setColumnOrder(
				reorderColumn(
					column,
					hoveredColumn,
					getValidColumnOrder(table.options, columnOrder)
				)
			)
		}
	}

	const handleDragEnter = () => {
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
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						gap: '8px',
					}}
				>
					{!isSubMenu &&
						columnDefType !== 'group' &&
						enableColumnOrdering &&
						!allColumns.some(
							(col) => col.columnDef.columnDefType === 'group'
						) &&
						(columnDef.enableColumnOrdering !== false ? (
							<GrabHandleButton
								onDragEnd={handleDragEnd}
								onDragStart={handleDragStart}
								table={table}
							/>
						) : (
							<Box sx={{ width: '28px' }} />
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
									<Switch />
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
				</Box>
			</MenuItem>
			{column.columns?.map((c: Table_Column<TData>, i) => (
				<ShowHideColumnsMenuItems
					allColumns={allColumns}
					column={c}
					hoveredColumn={hoveredColumn}
					isSubMenu={isSubMenu}
					key={`${i}-${c.id}`}
					setHoveredColumn={setHoveredColumn}
					table={table}
				/>
			))}
		</>
	)
}
