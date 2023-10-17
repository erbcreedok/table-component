import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Divider, IconButton, Typography } from '@mui/material'

import type { TableInstance } from '../../../../index'
import { Table_Column, TableData } from '../../../../index'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import {
	SimpleMenuItem,
	SimpleMenuItemProps,
} from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'
import { Sidebar } from '../../../../components/Sidebar'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { SidebarSearch } from '../../../../components/SidebarSearch'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeGroupingMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) => allColumns.filter((col) => col.getIsVisible() && col.getCanGroup())

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getAllColumns,
		setGrouping,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeGroupingMenu = defaultOrganizeGroupingMenu,
		},
	} = table
	const [searchValue, setSearchValue] = useState('')
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const allColumns = organizeGroupingMenu(getAllColumns())

	const [groupedList, ungroupedList] = splitArrayItems(allColumns, (col) =>
		col.getIsGrouped()
	)

	const [suggestedList, areSuggestedShown] = useMemo(() => {
		if (searchValue) {
			return [
				ungroupedList.filter((col) =>
					col.columnDef.header.toLowerCase().includes(searchValue)
				),
				false,
			]
		}

		if (suggestedColumns?.grouping) {
			const suggested = ungroupedList.filter(({ id }) =>
				suggestedColumns.grouping?.includes(id)
			)

			if (suggested.length) return [suggested, true]
		}

		return [ungroupedList, false]
	}, [searchValue, suggestedColumns?.grouping, ungroupedList])

	const handleCloseClick = () => setAnchorEl(null)

	const removeAllGroup = () => {
		setGrouping([])
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
					suggestedList.length ? (
						suggestedList.map((column) => (
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
						{Boolean(groupedList.length) && (
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

								{groupedList.map((column) => (
									<MenuItem
										column={column as Table_Column<TData>}
										key={(column as Table_Column<TData>).id}
										enableDrag={groupedList.length > 1}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isCompact
										disableRipple
									/>
								))}
							</>
						)}

						{Boolean(suggestedList.length) && (
							<>
								{(Boolean(groupedList.length) || areSuggestedShown) && (
									<ListTitle sx={{ padding: '0 24px', margin: '20px 0 ' }}>
										{areSuggestedShown
											? localization.suggested
											: localization.columns}
									</ListTitle>
								)}

								{suggestedList.map((column) => (
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
