import { Row, RowData, RowModel, Table } from '@tanstack/table-core'

import { TableInstance } from '../TableComponent'

import { createTableRow } from './createTableRow'

export function filterRows<TData extends RowData>(
	rows: Row<TData>[],
	filterRowImpl: (row: Row<TData>) => any,
	table: Table<TData>
) {
	if (table.options.filterFromLeafRows) {
		return filterRowModelFromLeafs(rows, filterRowImpl, table)
	}

	return filterRowModelFromRoot(rows, filterRowImpl, table)
}

export function filterRowModelFromLeafs<TData extends RowData>(
	rowsToFilter: Row<TData>[],
	filterRow: (row: Row<TData>) => boolean,
	table: Table<TData>
): RowModel<TData> {
	const newFilteredFlatRows: Row<TData>[] = []
	const newFilteredRowsById: Record<string, Row<TData>> = {}
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

	const recurseFilterRows = (rowsToFilter: Row<TData>[], depth = 0) => {
		const rows: Row<TData>[] = []

		// Filter from children up first
		for (let i = 0; i < rowsToFilter.length; i++) {
			let row = rowsToFilter[i]

			const newRow = createTableRow(
				table as unknown as TableInstance<TData>,
				row.id,
				row.original,
				row.index,
				row.depth
			) as Row<TData>
			newRow.getParent = row.getParent
			newRow.columnFilters = row.columnFilters

			if (row.subRows?.length && depth < maxDepth) {
				newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
				row = newRow

				if (filterRow(row) && !newRow.subRows.length) {
					rows.push(row)
					newFilteredRowsById[row.id] = row
					newFilteredFlatRows.push(row)
					// eslint-disable-next-line no-continue
					continue
				}

				if (filterRow(row) || newRow.subRows.length) {
					rows.push(row)
					newFilteredRowsById[row.id] = row
					newFilteredFlatRows.push(row)
					// eslint-disable-next-line no-continue
					continue
				}
			} else {
				row = newRow
				if (filterRow(row)) {
					rows.push(row)
					newFilteredRowsById[row.id] = row
					newFilteredFlatRows.push(row)
				}
			}
		}

		return rows
	}

	return {
		rows: recurseFilterRows(rowsToFilter),
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById,
	}
}

export function filterRowModelFromRoot<TData extends RowData>(
	rowsToFilter: Row<TData>[],
	filterRow: (row: Row<TData>) => any,
	table: Table<TData>
): RowModel<TData> {
	const newFilteredFlatRows: Row<TData>[] = []
	const newFilteredRowsById: Record<string, Row<TData>> = {}
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

	// Filters top level and nested rows
	const recurseFilterRows = (rowsToFilter: Row<TData>[], depth = 0) => {
		// Filter from parents downward first

		const rows: Row<TData>[] = []

		// Apply the filter to any subRows
		for (let i = 0; i < rowsToFilter.length; i++) {
			let row = rowsToFilter[i]

			const pass = filterRow(row)

			if (pass) {
				if (row.subRows?.length && depth < maxDepth) {
					const newRow = createTableRow(
						table as unknown as TableInstance<TData>,
						row.id,
						row.original,
						row.index,
						row.depth
					) as Row<TData>
					newRow.getParent = row.getParent
					newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
					row = newRow
				}

				rows.push(row)
				newFilteredFlatRows.push(row)
				newFilteredRowsById[row.id] = row
			}
		}

		return rows
	}

	return {
		rows: recurseFilterRows(rowsToFilter),
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById,
	}
}
