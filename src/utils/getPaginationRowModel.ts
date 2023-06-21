import {
	Table,
	RowModel,
	Row,
	RowData,
	memo,
	expandRows,
} from '@tanstack/table-core'

export function getPaginationRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.getState().pagination,
				table.getPrePaginationRowModel(),
				table.options.paginateExpandedRows
					? undefined
					: table.getState().expanded,
			],
			(pagination, rowModel) => {
				if (!rowModel.rows.length) {
					return rowModel
				}

				const { pageSize, pageIndex } = pagination
				let { rows } = rowModel
				const { flatRows, rowsById } = rowModel
				const pageStart = pageSize * pageIndex
				const pageEnd = pageStart + pageSize

				rows = rows.slice(pageStart, pageEnd)

				let paginatedRowModel: RowModel<TData>

				if (!table.options.paginateExpandedRows) {
					paginatedRowModel = expandRows({
						rows,
						flatRows,
						rowsById,
					})
				} else {
					paginatedRowModel = {
						rows,
						flatRows,
						rowsById,
					}
				}

				paginatedRowModel.flatRows = []

				const handleRow = (row: Row<TData>) => {
					paginatedRowModel.flatRows.push(row)
					if (row.subRows.length) {
						row.subRows.forEach(handleRow)
					}
				}

				paginatedRowModel.rows.forEach(handleRow)

				return paginatedRowModel
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getPaginationRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
			}
		)
}
