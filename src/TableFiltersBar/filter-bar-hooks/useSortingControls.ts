import { useMemo } from 'react'

import { TableInstance } from '../../TableComponent'

export const useSortingControls = <TData extends Record<string, any> = {}>(
	table: TableInstance<TData>
) => {
	const { getAllColumns, getState } = table

	const { sorting, columnOrder, columnPinning, columnVisibility, grouping } =
		getState()

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
	])

	return {
		allColumns,
	}
}
