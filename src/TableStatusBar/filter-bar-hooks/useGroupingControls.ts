import { getColumnsFilteredByDisplay, TableInstance } from '../../'
import { sortColumns } from '../../utils/sortColumns'
import { splitArrayItems } from '../../utils/splitArrayItems'

export const useGroupingControls = <TData extends Record<string, any> = {}>(
	table: TableInstance<TData>
) => {
	const { getVisibleLeafColumns } = table

	const allColumns = sortColumns(
		getColumnsFilteredByDisplay(getVisibleLeafColumns())
	)

	const [groupedList, nonGroupedList] = splitArrayItems(allColumns, (col) =>
		col.getIsGrouped()
	)

	return {
		groupedList,
		nonGroupedList,
		allColumns,
	}
}
