import { getColumnId } from '../column.utils'
import { SelectOption, Table_Column, TableInstance } from '../TableComponent'

import { getColumnUnfilteredFacetedValues } from './getColumnUnfilteredFacetedValues'

const getOption = (
	value: string,
	formatter: (value: unknown) => string = (value) =>
		value === undefined || value === null ? 'N/A' : `${value}`
): SelectOption => {
	const label = formatter(value) || 'N/A'

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
	const { formatCellValue } = column.columnDef
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

	return Array.from(facetedUniqueValues.keys())
		.sort()
		.map((value) => getOption(value, formatCellValue))
}
