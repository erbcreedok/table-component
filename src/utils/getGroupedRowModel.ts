import { Row, Table } from '@tanstack/react-table'
import { memo, RowData, RowModel, SortingFn } from '@tanstack/table-core'

export function getGroupedRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
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

				const columnInfoById: Record<
					string,
					{
						sortUndefined?: false | -1 | 1
						invertSorting?: boolean
						sortingFn: SortingFn<TData>
					}
				> = {}

				existingGrouping.forEach((groupEntry) => {
					const column = table.getColumn(groupEntry)

					columnInfoById[groupEntry] = {
						sortUndefined: column.columnDef.sortUndefined,
						invertSorting: column.columnDef.invertSorting,
						sortingFn: column.getSortingFn(),
					}
				})

				// Recursively group the data
				const groupUpRecursively = (
					rows: Row<TData>[]
					// eslint-disable-next-line default-param-last
				) => {
					const groupedData = [...rows]

					groupedData.sort((rowA, rowB) => {
						for (let i = 0; i < existingGrouping.length; i += 1) {
							const groupEntry = existingGrouping[i]
							const columnInfo = columnInfoById[groupEntry]
							const isDesc = false
							if (columnInfo.sortUndefined) {
								const aValue = rowA.getValue(groupEntry)
								const bValue = rowB.getValue(groupEntry)

								const aUndefined = typeof aValue === 'undefined'
								const bUndefined = typeof bValue === 'undefined'

								if (aUndefined || bUndefined) {
									return aUndefined && bUndefined
										? 0
										: aUndefined
										? columnInfo.sortUndefined
										: -columnInfo.sortUndefined
								}
							}

							let sortInt = columnInfo.sortingFn(rowA, rowB, groupEntry)

							if (sortInt !== 0) {
								if (isDesc) {
									sortInt *= -1
								}

								if (columnInfo.invertSorting) {
									sortInt *= -1
								}

								return sortInt
							}
						}

						return rowA.index - rowB.index
					})

					// If there are sub-rows, sort them
					groupedData.forEach((row) => {
						groupedFlatRows.push(row)
						if (row.subRows?.length) {
							row.subRows = groupUpRecursively(row.subRows)
						}
					})

					return groupedData
				}

				const groupedRows = groupUpRecursively(rowModel.rows)

				return {
					rows: groupedRows,
					flatRows: groupedFlatRows,
					rowsById: rowModel.rowsById,
				}
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getGroupedRowModel',
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
