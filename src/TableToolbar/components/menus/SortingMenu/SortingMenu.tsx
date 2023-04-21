import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import type { TableInstance, Table_Column } from '../../../../index'
import { SidebarHeaderComponent } from '../components/SIdebarHeader'
import { SidebarSearchComponent } from '../components/SidebarSearch'
import { SimpleMenuItem } from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const SortingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const { getAllColumns, getState, resetSorting } = table
	const { columnPinning, columnOrder, columnVisibility, grouping, sorting } =
		getState()
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const handleCloseCLick = () => setAnchorEl(null)

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		return columns.filter((col) => col.getIsVisible() && col.getCanSort())
	}, [
		columnOrder,
		columnPinning,
		columnVisibility,
		grouping,
		sorting,
		getAllColumns,
	]) as Array<Table_Column<TData>>

	const sortedList = useMemo(
		() =>
			(sorting || []).map((item) =>
				getAllColumns().find((col) => getColumnId(col.columnDef) === item.id)
			),
		[sorting]
	)

	const nonSortedList = useMemo(
		() => allColumns.filter((col) => !col.getIsSorted()),
		[sorting]
	)

	const handleOnSearchChange = (value: string) => {
		setSearchList(
			value.length >= 3
				? allColumns.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		const currentOrder = sorting.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting(true)

		newOrder.forEach((id) => {
			const target = allColumns.find(
				(col) => getColumnId(col.columnDef) === id
			) as Table_Column<TData>
			const targetDirection = sorting.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	const removeAllSorted = () => {
		resetSorting(true)
	}

	useEffect(() => {
		if (searchList.length) {
			setSearchList([])
		}
	}, [sorting])

	return (
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 600 }}>
				<SidebarHeaderComponent title="Sorting" onClick={handleCloseCLick} />
				<SidebarSearchComponent
					reset={!searchList.length}
					onChange={handleOnSearchChange}
				/>

				<Box sx={{ marginTop: '12px' }}>
					{searchList.length > 0 &&
						searchList.map((column) => (
							<SimpleMenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								isSorting
								withClickOnItem
							/>
						))}

					{Boolean(sortedList.length && !searchList.length) && (
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
								<ListTitle>Sorted</ListTitle>
								<ButtonLink onClick={removeAllSorted}>Remove all</ButtonLink>
							</Box>

							{sortedList.map((column) => (
								<SimpleMenuItem
									column={column as Table_Column<TData>}
									key={(column as Table_Column<TData>).id}
									enableDrag={sortedList.length > 1}
									hoveredColumn={hoveredColumn}
									onColumnOrderChange={onColumnOrderChanged}
									setHoveredColumn={setHoveredColumn}
									isSorting
									isCompact
								/>
							))}
						</>
					)}

					<>
						{!!sortedList.length &&
							!searchList.length &&
							!!nonSortedList.length && (
								<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
									Columns
								</ListTitle>
							)}
						{Boolean(nonSortedList.length && !searchList.length) &&
							nonSortedList.map((column) => (
								<SimpleMenuItem
									column={column}
									key={column.id}
									hoveredColumn={hoveredColumn}
									onColumnOrderChange={onColumnOrderChanged}
									setHoveredColumn={setHoveredColumn}
									isSorting
									withClickOnItem
								/>
							))}
					</>
				</Box>
			</Box>
		</Drawer>
	)
}
