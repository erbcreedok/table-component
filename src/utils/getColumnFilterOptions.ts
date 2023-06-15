import { TableInstance, Table_Column } from '../TableComponent'

import { getColumnFilterDefaultOptions } from './getColumnFilterDefaultOptions'

export const getColumnFilterOptions = <TData extends Record<string, any>>(
	column: Table_Column<TData>,
	table: TableInstance<TData>
) => {
	const normalizeSelectOptions = (
		selectOptions: (string | { label: string; value: any })[]
	) => {
		return selectOptions.map((option) => {
			if (typeof option === 'string') {
				return {
					label: option,
					value: option,
				}
			}

			return option
		})
	}

	return column.columnDef.filterSelectOptions
		? normalizeSelectOptions(column.columnDef.filterSelectOptions)
		: getColumnFilterDefaultOptions(column, table)
}
