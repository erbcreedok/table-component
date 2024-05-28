/* eslint-disable default-param-last */
import { Table, Row, RowModel, RowData, memo } from '@tanstack/table-core'

import { TableInstance } from '../TableComponent'

import { createRow } from './createRow'
import { flattenRows } from './flattenRows'

export function getCoreRowModel<TData extends RowData>(options?: {
	getIsMock?: (data: TData) => boolean
}): (table: Table<TData>) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.options.data,
				(table as TableInstance).getState().searchData as unknown as
					| Row<TData>[]
					| null,
			],
			(
				data,
				searchData
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

				if (searchData) {
					const flatRows = flattenRows<TData>(searchData)
					rowModel.rows = searchData
					rowModel.flatRows = flatRows
					rowModel.rowsById = flatRows.reduce((acc, row) => {
						acc[row.id] = row

						return acc
					}, rowModel.rowsById)

					return rowModel
				}

				const accessRows = (
					originalRows: TData[],
					depth = 0,
					parent?: Row<TData>
				): Row<TData>[] => {
					const rows = [] as Row<TData>[]

					for (let i = 0; i < originalRows.length; i++) {
						// This could be an expensive check at scale, so we should move it somewhere else, but where?
						// if (!id) {
						//   if (process.env.NODE_ENV !== 'production') {
						//     throw new Error(`getRowId expected an ID, but got ${id}`)
						//   }
						// }

						// Make the row
						const row = createRow(
							table,
							table._getRowId(originalRows[i], i, parent),
							originalRows[i],
							i,
							depth
						)
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
