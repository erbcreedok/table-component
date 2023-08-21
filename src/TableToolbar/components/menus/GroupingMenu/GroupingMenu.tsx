import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import type { TableInstance } from '../../../../index'
import { Table_Column } from '../../../../index'
import { SimpleMenuItem } from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'
import { Sidebar } from '../../../../components/Sidebar'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getState,
		getAllColumns,
		getLeftLeafColumns,
		getCenterLeafColumns,
		getRightLeafColumns,
		setGrouping,
		options: { innerTable, localization },
	} = table
	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		if (columnOrder.length > 0) {
			return Array.from(new Set(columnOrder))
				.map((colId) => getCenterLeafColumns().find((col) => col?.id === colId))
				.filter(
					(col) =>
						col?.id !== 'teamMember' &&
						col?.getIsVisible() &&
						col?.getCanGroup()
				)
		}

		return columns
			.filter((col) => col.id !== 'teamMember')
			.filter((col) => col.getIsVisible())
	}, [
		columnOrder,
		columnPinning,
		columnVisibility,
		grouping,
		getAllColumns,
		getCenterLeafColumns,
		getLeftLeafColumns,
		getRightLeafColumns,
	]) as Array<Table_Column<TData>>

	const groupedList = useMemo(
		() =>
			grouping.map((colId) =>
				getCenterLeafColumns().find((col) => col?.id === colId)
			),
		[grouping]
	)

	const nonGroupedList = useMemo(
		() => allColumns.filter((col) => !col.getIsGrouped()),
		[allColumns, grouping, columnVisibility]
	)

	const handleCloseClick = () => setAnchorEl(null)
	const handleOnSearchChange = (value: string) => {
		if (value) {
			setIsSearchActive(true)
		} else {
			setIsSearchActive(false)
		}
		setSearchList(
			value.length
				? allColumns.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const removeAllGroup = () => {
		allColumns.forEach((col) => {
			if (col.getIsGrouped()) {
				col.toggleGrouping()
			}
		})
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
			withSearch
			headerTitle={localization.group}
			onSearchChange={handleOnSearchChange}
			innerTableSidebar={innerTable}
		>
			<Box sx={{ marginTop: '12px' }}>
				{isSearchActive &&
					(searchList.length ? (
						searchList
							.filter((column) => !column.getIsGrouped())
							.map((column) => (
								<SimpleMenuItem
									column={column}
									key={column.id}
									hoveredColumn={hoveredColumn}
									onColumnOrderChange={onColumnOrderChanged}
									setHoveredColumn={setHoveredColumn}
									onItemClick={column.getToggleGroupingHandler()}
								/>
							))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							No options
						</Typography>
					))}

				{Boolean(
					groupedList.length && !searchList.length && !isSearchActive
				) && (
					<>
						<Box
							sx={{
								padding: '0 24px',
								margin: '12px 0 20px 0',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ListTitle>Grouped</ListTitle>
							<ButtonLink onClick={removeAllGroup}>Remove all</ButtonLink>
						</Box>

						{groupedList.map((column) => (
							<SimpleMenuItem
								column={column as Table_Column<TData>}
								key={(column as Table_Column<TData>).id}
								enableDrag={groupedList.length > 1}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								isCompact
							/>
						))}
					</>
				)}

				<>
					{!!groupedList.length &&
						!searchList.length &&
						!isSearchActive &&
						!!nonGroupedList.length && (
							<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
								Columns
							</ListTitle>
						)}
					{Boolean(
						nonGroupedList.length && !searchList.length && !isSearchActive
					) &&
						nonGroupedList.map((column) => (
							<SimpleMenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								onItemClick={column.getToggleGroupingHandler()}
							/>
						))}
				</>
			</Box>
		</Sidebar>
	)
}
