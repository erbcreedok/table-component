/* eslint-disable default-param-last */
import { Table, Row, RowModel, RowData, memo } from '@tanstack/table-core'

import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { createTableRow } from './createTableRow'
import { fillRowsWithParents } from './fillRowsWithParents'
import { flattenRows } from './flattenRows'

export function getCoreRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.options.data,
				(table as unknown as TableInstance).getState().searchData as unknown as
					| Row<TData>[]
					| null,
				(table as unknown as TableInstance).options.enableFlatSearch,
			],
			(
				data,
				searchData,
				enableFlatSearch
			): {
				rows: Row<TData>[]
				flatRows: Row<TData>[]
				rowsById: Record<string, Row<TData>>
			} => {
				const rowModel: RowModel<TData> = {
					rows: [],
					flatRows: [],
					rowsById: {},
				}

				const accessRows = (
					originalRows: TData[],
					depth = 0,
					parent?: Row<TData>
				): Row<TData>[] => {
					const rows = [] as Row<TData>[]

					for (let i = 0; i < originalRows.length; i++) {
						// Make the row
						const row = createTableRow(
							table as unknown as TableInstance,
							table._getRowId(originalRows[i], i, parent),
							originalRows[i] as TableData,
							i,
							depth
						) as Row<TData>
						Object.assign(row, {
							getParent: () => parent,
						})

						// Keep track of every row in a flat array
						rowModel.flatRows.push(row)
						// Also keep track of every row by its ID
						rowModel.rowsById[row.id] = row
						// Push table row into parent
						rows.push(row)

						// Get the original subrows
						if (table.options.getSubRows) {
							row.originalSubRows = table.options.getSubRows(originalRows[i], i)

							// Then recursively access them
							if (row.originalSubRows?.length) {
								row.subRows = accessRows(row.originalSubRows, depth + 1, row)
							}
						}
					}

					return rows
				}

				rowModel.rows = accessRows(data)

				if (searchData) {
					return getSearchRowModel(searchData, rowModel, enableFlatSearch)
				}

				return rowModel
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
				onChange: () => {
					table._autoResetPageIndex()
				},
			}
		)
}

const getSearchRowModel = <TData extends RowData>(
	searchData: Row<TData>[],
	rowModel: RowModel<TData>,
	enableFlatSearch?: boolean
) => {
	// If we have search data, we need to flatten it and then rebuild the row model
	const searchRowModel: RowModel<TData> = {
		rows: searchData.map((row) => rowModel.rowsById[row.id] ?? row),
		flatRows: [],
		rowsById: {},
	}
	// If we are in flat mode, we should return rows without subrows
	if (enableFlatSearch) {
		searchRowModel.rows = searchRowModel.rows.map((row) => ({
			...row,
			depth: 0,
			subRows: [],
			getCanExpand: () => false,
		}))
		searchRowModel.flatRows = searchRowModel.rows
	} else {
		// If we aren't in flat mode, we add mock parents to the rows
		searchRowModel.rows = fillRowsWithParents(
			searchRowModel.rows as Table_Row[]
		) as Row<TData>[]
		searchRowModel.flatRows = flattenRows(searchRowModel.rows)
	}
	// Then we rebuild the rowsById
	searchRowModel.flatRows.forEach((row) => {
		searchRowModel.rowsById[row.id] = row
	})

	return searchRowModel
}
