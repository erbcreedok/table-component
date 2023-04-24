import React, { FC, useState } from 'react'

import { Table_Column } from 'src'

import { reorderColumn } from '../../../column.utils'
import { NoOptions } from '../../NoOptions/NoOptions'

import { ListItemSort } from './ListItemSort'

interface SelectedSortsListProps {
	sortedList: any
	resetSorting: any
	allColumns: any
	sorting: any
	table: any
}

export const SelectedSortsList: FC<SelectedSortsListProps> = (props) => {
	const { resetSorting, sortedList, allColumns, sorting, table } = props

	const [hoveredColumn, setHoveredColumn] = useState<any>(null)

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		const currentOrder = sorting?.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting()

		newOrder.forEach((id) => {
			const target = allColumns.find(
				(col) => col.id === id
			) as Table_Column<TData>
			const targetDirection = sorting?.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	if (!sortedList.length) {
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
