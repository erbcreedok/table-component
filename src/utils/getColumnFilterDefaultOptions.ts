import { getColumnId } from '../column.utils'
import { FilterOption, Table_Column, TableInstance } from '../TableComponent'

import { getColumnUnfilteredFacetedValues } from './getColumnUnfilteredFacetedValues'

const getOption = (value: string): FilterOption => {
	const label = value === undefined || value === null ? 'N/A' : value

	return {
		label,
		value,
	}
}
export const getColumnFilterDefaultOptions = <
	TData extends Record<string, any>
>(
	column: Table_Column<TData>,
	table: TableInstance<TData>
) => {
	const { columnFilters } = table.getState()
	const columnFilter = columnFilters.find(
		(c) => c.id === getColumnId(column.columnDef)
	)

	const facetedUniqueValues = getColumnUnfilteredFacetedValues(
		getColumnId(column.columnDef),
		table
	)

	if (columnFilter && Array.isArray(columnFilter?.value)) {
		columnFilter.value.forEach((value) => {
			if (!facetedUniqueValues.has(value)) {
				facetedUniqueValues.set(value, 1)
			}
		})
	}

	return Array.from(facetedUniqueValues.keys()).sort().map(getOption)
}
