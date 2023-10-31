import type {
	Table_Cell,
	Table_Column,
	Table_HeaderGroup,
	TableData,
} from '../TableComponent'

export const getColumnsFilteredByDisplay = <TData extends TableData>(
	columns: Table_Column<TData>[]
) => columns.filter((column) => !column.columnDef.notDisplayed)

export const getCellsFilteredByDisplay = (cells: Table_Cell[]) =>
	cells.filter((cell) => !cell.column.columnDef.notDisplayed)

export const getHeaderGroupFilteredByDisplay = (
	headerGroup: Table_HeaderGroup
) => ({
	...headerGroup,
	headers: headerGroup.headers.filter(
		(header) => !header.column.columnDef.notDisplayed
	),
})
