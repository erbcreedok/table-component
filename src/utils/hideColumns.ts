import { TableInstance, TableData } from '../TableComponent'

export const hideColumns = <TData extends TableData = TableData>(
	colIds: string[],
	table: TableInstance<TData>
) => {
	const { setColumnVisibility, setGrouping, setSorting } = table

	const updatedVisibility = (columnVisibility) =>
		Object.keys(columnVisibility).reduce((acc, curr) => {
			if (colIds.includes(curr)) {
				acc[curr] = false
			} else {
				acc[curr] = columnVisibility[curr]
			}

			return acc
		}, {})

	setColumnVisibility(updatedVisibility)
	setGrouping((grouping) =>
		grouping.filter((groupedColId) => !colIds.includes(groupedColId))
	)
	setSorting((sorting) =>
		sorting.filter((sortingColumn) => !colIds.includes(sortingColumn.id))
	)
}
