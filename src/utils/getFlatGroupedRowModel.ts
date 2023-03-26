// eslint-disable-next-line import/no-extraneous-dependencies
import { Table, Row, RowModel, RowData, memo } from '@tanstack/table-core'

export type SortFunction = (a: unknown, b: unknown) => number
export type SortFunctions = Record<string, SortFunction>
export function getFlatGroupedRowModel<TData extends RowData>(
	sortFunctions?: SortFunctions
): (table: Table<TData>) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [table.getState().grouping, table.getPreGroupedRowModel()],
			(grouping, rowModel) => {
				if (!rowModel.rows.length || !grouping.length) {
					return rowModel
				}

				// Filter the grouping list down to columns that exist
				const existingGrouping = grouping.filter((columnId) =>
					table.getColumn(columnId)
				)

				const groupedFlatRows: Row<TData>[] = []
				const groupedRowsById: Record<string, Row<TData>> = {}
				// const onlyGroupedFlatRows: Row[] = [];
				// const onlyGroupedRowsById: Record<RowId, Row> = {};
				// const nonGroupedFlatRows: Row[] = [];
				// const nonGroupedRowsById: Record<RowId, Row> = {};

				// Recursively group the data
				const groupUpRecursively = (
					rows: Row<TData>[],
					depth = 0
				): Row<TData>[] => {
					// Grouping depth has been met
					// Stop grouping and simply rewrite thd depth and row relationships
					if (depth >= existingGrouping.length) {
						return rows.map((row) => {
							row.depth = depth

							groupedFlatRows.push(row)
							groupedRowsById[row.id] = row

							return row
						})
					}

					const columnId = existingGrouping[depth]!

					// Group the rows together for this level
					const rowGroupsMap = groupBy(rows, columnId)

					const sortFunction =
						sortFunctions?.[columnId] ??
						((a: unknown, b: unknown) => `${a}`.localeCompare(`${b}`))

					return Array.from(rowGroupsMap.entries())
						.sort(([aKey], [bKey]) => sortFunction(aKey, bKey))
						.map(([, groupedRows]) => {
							// First, Recurse to group sub rows before aggregation
							return groupUpRecursively(groupedRows, depth + 1)
						})
						.flat(1)
				}

				const groupedRows = groupUpRecursively(rowModel.rows, 0)

				groupedRows.forEach((subRow: any) => {
					groupedFlatRows.push(subRow)
					groupedRowsById[subRow.id] = subRow
					// if (subRow.getIsGrouped?.()) {
					//   onlyGroupedFlatRows.push(subRow);
					//   onlyGroupedRowsById[subRow.id] = subRow;
					// } else {
					//   nonGroupedFlatRows.push(subRow);
					//   nonGroupedRowsById[subRow.id] = subRow;
					// }
				})

				return {
					rows: groupedRows,
					flatRows: groupedFlatRows,
					rowsById: groupedRowsById,
				}
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getFlatGroupedRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
				onChange: () => {
					table._queue(() => {
						table._autoResetExpanded()
						table._autoResetPageIndex()
					})
				},
			}
		)
}

function groupBy<TData extends RowData>(rows: Row<TData>[], columnId: string) {
	const groupMap = new Map<any, Row<TData>[]>()

	return rows.reduce((map, row) => {
		const resKey = `${row.getValue(columnId)}`
		const previous = map.get(resKey)
		if (!previous) {
			map.set(resKey, [row])
		} else {
			previous.push(row)
		}

		return map
	}, groupMap)
}
