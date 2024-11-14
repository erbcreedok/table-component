import { Table_Row } from '../TableComponent'

export const getIsMockRow = <TData>(row: Table_Row<TData>) => {
	if (row.isMock) return true
	const filters = Object.values(row.columnFilters ?? {})

	return filters.length > 0 ? filters.every((x) => !x) : false
}
