/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Row, Table } from '@tanstack/react-table'
import { memo, RowData, RowModel, SortingFn } from '@tanstack/table-core'

export function getSortedRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [table.getState().sorting, table.getFilteredRowModel()],
			(sortingState, rowModel) => {
				if (!rowModel.rows.length || !sortingState?.length) {
					return rowModel
				}

				const sortedFlatRows: Row<TData>[] = []

				// Filter out sortings that correspond to non existing columns
				const availableSorting = sortingState.filter((sort) =>
					table.getColumn(sort.id).getCanSort()
				)

				const columnInfoById: Record<
					string,
					{
						sortUndefined?: false | -1 | 1
						invertSorting?: boolean
						sortingFn: SortingFn<TData>
					}
				> = {}

				availableSorting.forEach((sortEntry) => {
					const column = table.getColumn(sortEntry.id)

					columnInfoById[sortEntry.id] = {
						sortUndefined: column.columnDef.sortUndefined,
						invertSorting: column.columnDef.invertSorting,
						sortingFn: column.getSortingFn(),
					}
				})

				const sortData = (rows: Row<TData>[]) => {
					// This will also perform a stable sorting using the row index
					// if needed.
					const sortedData = [...rows]

					sortedData.sort((rowA, rowB) => {
						for (let i = 0; i < availableSorting.length; i += 1) {
							const sortEntry = availableSorting[i]!
							const columnInfo = columnInfoById[sortEntry.id]!
							const isDesc = sortEntry?.desc ?? false

							if (columnInfo.sortUndefined) {
								const aValue = rowA.getValue(sortEntry.id)
								const bValue = rowB.getValue(sortEntry.id)

								const aUndefined =
									typeof aValue === 'undefined' || aValue === null
								const bUndefined =
									typeof bValue === 'undefined' || bValue === null

								if (aUndefined || bUndefined) {
									return aUndefined && bUndefined
										? 0
										: aUndefined
										? columnInfo.sortUndefined
										: -columnInfo.sortUndefined
								}
							}

							// This function should always return in ascending order
							let sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id)

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
					sortedData.forEach((row, i) => {
						const newRow = { ...row }
						sortedFlatRows.push(newRow)
						if (row.subRows?.length) {
							newRow.subRows = sortData(row.subRows)
						}
						sortedData[i] = newRow
					})

					return sortedData
				}

				return {
					rows: sortData(rowModel.rows),
					flatRows: sortedFlatRows,
					rowsById: rowModel.rowsById,
				}
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getSortedRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
				onChange: () => {
					table._autoResetPageIndex()
				},
			}
		)
}
