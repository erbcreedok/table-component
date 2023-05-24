import { useMemo } from 'react'

import { Table_Column, TableInstance } from '../../'

export const useGroupingControls = <TData extends Record<string, any> = {}>(
	table: TableInstance<TData>
) => {
	const {
		getState,
		getAllColumns,
		getLeftLeafColumns,
		getCenterLeafColumns,
		getRightLeafColumns,
	} = table

	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		if (columnOrder.length > 0) {
			return Array.from(new Set(columnOrder))
				.map((colId) => getCenterLeafColumns().find((col) => col?.id === colId))
				.filter(
					(col) =>
						col?.id !== 'member.id' && col?.getIsVisible() && col?.getCanGroup()
				)
		}

		return columns
			.filter((col) => col.id !== 'member.id')
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
	]) as Array<Table_Column<any>>

	const nonGroupedList = useMemo(
		() => allColumns.filter((col) => !col.getIsGrouped()),
		[allColumns, grouping, columnVisibility]
	)

	const removeAllGroup = () => {
		allColumns.forEach((col) => {
			if (col.getIsGrouped()) {
				col.toggleGrouping()
			}
		})
	}

	const groupedList = useMemo(
		() =>
			grouping
				.map((colId) => getCenterLeafColumns().find((col) => col?.id === colId))
				.filter(Boolean) as Table_Column<TData>[],
		[grouping]
	)

	return {
		groupedList,
		nonGroupedList,
		allColumns,
		removeAllGroup,
	}
}
