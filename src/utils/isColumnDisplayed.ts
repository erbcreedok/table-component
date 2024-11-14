import type { Table_Column } from '../TableComponent'

export const isColumnDisplayed = (column: Table_Column): boolean =>
	!column.columnDef.notDisplayed
