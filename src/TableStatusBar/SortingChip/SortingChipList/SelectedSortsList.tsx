import { ColumnSort } from '@tanstack/react-table'
import React, { useState } from 'react'

import { Table_Column, TableData, TableInstance } from '../../../'
import { reorderColumn } from '../../../column.utils'
import { NoOptions } from '../../../components'

import { ListItemSort } from './ListItemSort'

interface SelectedSortsListProps<TData = TableData> {
	sortedList?: (Table_Column<TData> | undefined)[]
	resetSorting(): void
	allColumns: Table_Column<TData>[]
	sorting: ColumnSort[]
	table: TableInstance<TData>
}

export const SelectedSortsList = (props: SelectedSortsListProps) => {
	const { resetSorting, sortedList, allColumns, sorting, table } = props

	const [hoveredColumn, setHoveredColumn] = useState<any>(null)

	const onColumnOrderChanged = (
		column: Table_Column,
		hovered: Table_Column
	) => {
		const currentOrder = sorting?.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting()

		newOrder.forEach((id) => {
			const target = allColumns.find((col) => col.id === id) as Table_Column
			const targetDirection = sorting?.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	if (!sortedList?.length) {
		return <NoOptions />
	}

	return (
		<>
			{sortedList?.map((column: any) => {
				return (
					<ListItemSort
						key={column.id}
						column={column}
						table={table}
						isDragable={sortedList?.length > 1}
						hoveredColumn={hoveredColumn}
						setHoveredColumn={setHoveredColumn}
						onColumnOrderChanged={onColumnOrderChanged}
					/>
				)
			})}
		</>
	)
}
