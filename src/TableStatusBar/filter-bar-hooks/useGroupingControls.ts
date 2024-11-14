import { TableInstance } from '../../'
import { splitArrayItems } from '../../utils/splitArrayItems'

export const useGroupingControls = <TData>(table: TableInstance<TData>) => {
	const { getVisibleLeafColumns } = table

	const allColumns = getVisibleLeafColumns().filter((col) => col.getCanGroup())

	const [groupedList, nonGroupedList] = splitArrayItems(allColumns, (col) =>
		col.getIsGrouped()
	)

	return {
		groupedList,
		nonGroupedList,
		allColumns,
	}
}
