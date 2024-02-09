import { Table_Row, TableData } from '../TableComponent'

export const getIsMockRow = <TData extends TableData = TableData>(
	row: Table_Row<TData>
) => {
	if (row.isMock) return true
	const filters = Object.values(row.columnFilters ?? {})

	return filters.length > 0 ? filters.every((x) => !x) : false
}
