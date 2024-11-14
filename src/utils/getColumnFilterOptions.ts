import { Table_Column, TableInstance } from '../TableComponent'

import { getColumnFilterDefaultOptions } from './getColumnFilterDefaultOptions'
import { normalizeSelectOptions } from './normalizeSelectOptions'

export const getColumnFilterOptions = (
	column: Table_Column,
	table: TableInstance
) => {
	return column.columnDef.filterSelectOptions
		? normalizeSelectOptions(column.columnDef.filterSelectOptions)
		: getColumnFilterDefaultOptions(column, table)
}
