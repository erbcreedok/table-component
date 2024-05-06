import type { Table_Column, TableData } from '../TableComponent'

export const isColumnDisplayed = <TData extends TableData = TableData>(
	column: Table_Column | Table_Column<TData>
): boolean => !column.columnDef.notDisplayed
