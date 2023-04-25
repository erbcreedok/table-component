import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import type { TableInstance } from '../../../../index'
import { SidebarHeaderComponent } from '../components/SidebarHeader'
import { SidebarSearchComponent } from '../components/SidebarSearch'
import { Table_Column } from '../../../../index'
import { SimpleMenuItem } from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'

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
	} = table
	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()
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

	const handleCloseCLick = () => setAnchorEl(null)
	const handleOnSearchChange = (value: string) => {
		setSearchList(
			value.length >= 3
				? getAllColumns().filter((col) =>
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
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 500 }}>
				<SidebarHeaderComponent title="Grouping" onClick={handleCloseCLick} />
				<SidebarSearchComponent
					onChange={handleOnSearchChange}
					reset={!searchList.length}
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

					{Boolean(groupedList.length && !searchList.length) && (
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
							!!nonGroupedList.length && (
								<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
									Columns
								</ListTitle>
							)}
						{Boolean(nonGroupedList.length && !searchList.length) &&
							nonGroupedList.map((column) => (
								<SimpleMenuItem
									column={column}
									key={column.id}
									hoveredColumn={hoveredColumn}
									onColumnOrderChange={onColumnOrderChanged}
									setHoveredColumn={setHoveredColumn}
									withClickOnItem
								/>
							))}
					</>
				</Box>
			</Box>
		</Drawer>
	)
}
