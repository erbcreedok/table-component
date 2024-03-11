import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Divider, IconButton, Typography } from '@mui/material'

import { TableInstance, TableData, Table_Column } from '../../../../index'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { getColumnsFilteredByDisplay } from '../../../../utils/getFilteredByDisplay'
import {
	SimpleMenuItem,
	SimpleMenuItemProps,
} from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'
import { Sidebar } from '../../../../components/Sidebar'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { SidebarSearch } from '../../../../components/SidebarSearch'
import { getOrderedColumns } from '../../../../utils/getOrderedColumns'
import { getSuggestedColumns } from '../../../../utils/getSuggestedColumns'
import { sortByStringArray } from '../../../../utils/sortByStringArray'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeGroupingMenu = <TData extends TableData = {}>(
	allColumns: readonly Table_Column<TData>[]
) =>
	getColumnsFilteredByDisplay(
		allColumns.filter((col) => col.getIsVisible() && col.getCanGroup())
	)

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getState,
		getAllColumns,
		resetGrouping,
		setGrouping,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeGroupingMenu,
		},
	} = table
	const [searchValue, setSearchValue] = useState('')
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)

	const { grouping } = getState() // this updates memo below
	const { groupedColumns, ungroupedColumns, areSuggestedShown } =
		useMemo(() => {
			const allColumns = getOrderedColumns(
				getAllColumns(),
				defaultOrganizeGroupingMenu,
				organizeGroupingMenu
			)

			const [groupedColumns, ungroupedColumns] = splitArrayItems(
				allColumns,
				(col) => grouping.includes(getColumnId(col))
			)

			let result: Table_Column<TData>[]
			let areSuggestedShown = false

			if (searchValue)
				result = ungroupedColumns.filter((col) =>
					col.columnDef.header.toLowerCase().includes(searchValue)
				)
			else
				[result, areSuggestedShown] = getSuggestedColumns(
					ungroupedColumns,
					suggestedColumns?.grouping
				)

			return {
				groupedColumns: sortByStringArray(
					groupedColumns,
					grouping,
					getColumnId
				),
				ungroupedColumns: result,
				areSuggestedShown,
			}
		}, [
			grouping,
			getAllColumns,
			organizeGroupingMenu,
			searchValue,
			suggestedColumns?.grouping,
		])

	const handleCloseClick = () => setAnchorEl(null)

	const removeAllGroup = () => {
		resetGrouping()
	}

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		setGrouping((old) => reorderColumn(column, hovered, old))
	}

	return (
		<Sidebar
			open={!!anchorEl}
			onClose={handleCloseClick}
			styles={{ minWidth: 500 }}
			withHeader
			headerTitle={localization.group}
			topPanel={
				<>
					<SidebarSearch value={searchValue} onValueChange={setSearchValue} />
					<Divider />
				</>
			}
			innerTableSidebar={innerTable}
		>
			<Box sx={{ marginTop: '12px' }}>
				{searchValue ? (
					ungroupedColumns.length > 0 ? (
						ungroupedColumns.map((column) => (
							<MenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								onClick={(e) => {
									setSearchValue('')
									column.toggleGrouping()
									e.stopPropagation()
								}}
							/>
						))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							No options
						</Typography>
					)
				) : (
					<>
						{groupedColumns.length > 0 && (
							<>
								<Box
									sx={{
										padding: '0 24px',
										margin: '20px 0 20px 0',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<ListTitle>Grouped</ListTitle>
									<ButtonLink onClick={removeAllGroup}>Remove all</ButtonLink>
								</Box>

								{groupedColumns.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										enableDrag={groupedColumns.length > 1}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isCompact
										disableRipple
									/>
								))}
							</>
						)}

						{ungroupedColumns.length > 0 && (
							<>
								{(groupedColumns.length > 0 || areSuggestedShown) && (
									<ListTitle sx={{ padding: '0 24px', margin: '20px 0 ' }}>
										{areSuggestedShown
											? localization.suggested
											: localization.columns}
									</ListTitle>
								)}

								{ungroupedColumns.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										onClick={(e) => {
											column.toggleGrouping()
											e.stopPropagation()
										}}
									/>
								))}
							</>
						)}
					</>
				)}
			</Box>
		</Sidebar>
	)
}

const MenuItem = <TData extends Record<string, any> = {}>({
	column,
	isCompact,
	onClick,
	...rest
}: SimpleMenuItemProps<TData>) => {
	return (
		<SimpleMenuItem
			column={column}
			key={column.id}
			isCompact={isCompact}
			onClick={onClick}
			{...rest}
		>
			{isCompact ? (
				<IconButton disableRipple onClick={column.toggleGrouping} size="small">
					<DeleteIcon />
				</IconButton>
			) : (
				<ButtonLink onClick={onClick} style={{ fontWeight: 600 }}>
					Add Item +
				</ButtonLink>
			)}
		</SimpleMenuItem>
	)
}
