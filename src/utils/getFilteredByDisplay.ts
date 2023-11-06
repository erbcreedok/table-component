import type {
	Table_Cell,
	Table_Column,
	Table_Header,
	Table_HeaderGroup,
	TableData,
} from '../TableComponent'

export const isColumnDisplayed = <TData extends TableData = TableData>(
	column: Table_Column | Table_Column<TData>
): boolean => !column.columnDef.notDisplayed

export const getColumnsFilteredByDisplay = <
	TData extends TableData = TableData
>(
	columns: Table_Column<TData>[]
) => columns.filter(isColumnDisplayed)

export const getCellsFilteredByDisplay = <TData extends TableData = TableData>(
	cells: Table_Cell<TData>[]
) => cells.filter((cell) => isColumnDisplayed(cell.column))

export const getHeadersFilteredByDisplay = <
	TData extends TableData = TableData
>(
	headers: Table_Header<TData>[]
) => headers.filter((header) => isColumnDisplayed(header.column))

export const getHeaderGroupFilteredByDisplay = (
	headerGroup: Table_HeaderGroup
) => ({
	...headerGroup,
	headers: getHeadersFilteredByDisplay(headerGroup.headers),
})
