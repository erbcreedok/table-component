import { TableData, TableInstance } from '../TableComponent'

export const getColumnUnfilteredFacetedValues = <TData extends TableData>(
	columnId: string,
	table: TableInstance<TData>
) => {
	const facetedUniqueValues = new Map()
	table.getPreFilteredRowModel().flatRows.forEach((row) => {
		const value = row.getValue(columnId)
		const count = facetedUniqueValues.get(value)
		if (count) {
			facetedUniqueValues.set(value, count + 1)
		} else {
			facetedUniqueValues.set(value, 1)
		}
	})

	return facetedUniqueValues
}
