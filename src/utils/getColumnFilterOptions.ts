import { TableInstance, Table_Column } from '../TableComponent'

import { getColumnFilterDefaultOptions } from './getColumnFilterDefaultOptions'
import { normalizeSelectOptions } from './normalizeSelectOptions'

export const getColumnFilterOptions = <TData extends Record<string, any>>(
	column: Table_Column<TData>,
	table: TableInstance<TData>
) => {
	return column.columnDef.filterSelectOptions
		? normalizeSelectOptions(column.columnDef.filterSelectOptions)
		: getColumnFilterDefaultOptions(column, table)
}
