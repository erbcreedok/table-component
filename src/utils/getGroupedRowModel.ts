/* eslint-disable consistent-return,no-prototype-builtins,default-param-last */
import { Row, Table } from '@tanstack/react-table'
import { createRow, memo, RowData, RowModel } from '@tanstack/table-core'

import {
	GroupCollapsed,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

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

export function getGroupedRowModel<
	TData extends RowData,
	TDData extends TableData
>(opt?: {
	isGroupableRow?: (row: Table_Row<TDData>) => boolean
}): (table: Table<TData>) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.getState().grouping,
				(table as unknown as TableInstance).getState().groupCollapsed,
				table.options.manualSorting
					? table.getPreGroupedRowModel()
					: table.getSortedRowModel(),
			],
			(grouping, groupCollapsed, rowModel) => {
				if (!rowModel.rows.length || !grouping.length) {
					return rowModel
				}

				// Filter the grouping list down to columns that exist
				const existingGrouping = grouping.filter((columnId) =>
					table.getColumn(columnId)
				)

				const groupedFlatRows: Row<TData>[] = []
				const groupedRowsById: Record<string, Row<TData>> = {}

				// Recursively group the data
				const groupUpRecursively = (
					rows: Row<TData>[],
					depth = 0,
					parentId?: string
				) => {
					let groupableRows: Row<TData>[] = []
					let notGroupableRows: Row<TData>[] = []
					if (opt?.isGroupableRow) {
						rows.forEach((row) => {
							if (!opt.isGroupableRow?.(row as any)) {
								notGroupableRows.push(row)
							} else {
								groupableRows.push(row)
							}
						})
					} else {
						groupableRows = rows
					}
					notGroupableRows = notGroupableRows.map((row) => {
						if (row.subRows && row.getIsExpanded() && row.subRows.length > 0) {
							return {
								...row,
								subRows: groupUpRecursively(row.subRows, depth, row.id),
							}
						}

						return row
					})
					// Grouping depth has been met
					// Stop grouping and simply rewrite thd depth and row relationships
					if (depth >= existingGrouping.length) {
						return groupableRows.map((row) => {
							row.depth = depth

							groupedFlatRows.push(row)
							groupedRowsById[row.id] = row

							if (row.subRows) {
								row.subRows = groupUpRecursively(row.subRows, depth + 1)
							}

							return row
						})
					}

					const columnId = existingGrouping[depth]

					// Group the rows together for this level
					const rowGroupsMap = groupBy(
						groupableRows.flatMap((row) => [
							{ ...row, subRows: [] },
							...(row.subRows ?? []),
						]),
						columnId
					)

					// Peform aggregations for each group
					const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
						([groupingValue, groupedRows], index) => {
							let id = `${columnId}:${groupingValue}`
							id = parentId ? `${parentId}>${id}` : id

							groupedRows.forEach((row) => {
								if (row.subRows) {
									row.subRows = groupUpRecursively(row.subRows, depth, row.id)
								}
							})

							const localRows = groupUpRecursively(groupedRows, depth + 1, id)

							const groupRow = createRow(
								table,
								id,
								groupedRows[0].original,
								index,
								depth,
								localRows
							)
							localRows.forEach((row) =>
								Object.assign(row, {
									groupIds: {
										...row.groupIds,
										[columnId]: id,
									},
									groupRows: {
										...row.groupRows,
										[id]: groupRow,
									},
								})
							)

							return localRows
						}
					)

					return [...aggregatedGroupedRows.flat(), ...notGroupableRows]
				}

				const groupedRows = groupUpRecursively(rowModel.rows, 0, '')

				groupedRows.forEach((subRow) => {
					groupedRowsById[subRow.id] = subRow
				})

				return collapseGroupedRows(
					{
						rows: groupedRows.flat(),
						flatRows: groupedFlatRows,
						rowsById: groupedRowsById,
					},
					groupCollapsed,
					grouping
				)
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

export function collapseGroupedRows<TData extends RowData>(
	rowModel: RowModel<TData>,
	groupCollapsed: GroupCollapsed,
	grouping: string[]
) {
	const groupFirstRow: Record<string, string> = {}

	const handleRow = (row: Row<TData>) => {
		const tableRow = row as unknown as Table_Row
		let newRow: Row<TData> | null = null
		const tGroupIds = tableRow.groupIds ?? {}
		const groupIds = Object.keys(tGroupIds)
			.sort((a, b) => grouping.indexOf(a) - grouping.indexOf(b))
			.map((key) => tGroupIds[key])
		const collapsedColumnIndex = groupIds.findIndex((id) => groupCollapsed[id])
		const collapsedGroup =
			collapsedColumnIndex > -1 ? groupIds[collapsedColumnIndex] : null

		// set first row of collapsed group
		if (collapsedGroup && !groupFirstRow[collapsedGroup]) {
			groupFirstRow[collapsedGroup] = row.id
		}
		// if collapsedGroup is false, then we shall keep row
		if (
			!collapsedGroup ||
			(tableRow.groupRows?.[collapsedGroup].subRows?.length ?? 2) <= 1
		) {
			delete (row as unknown as Table_Row).collapsedColumnIndex
			newRow = row
		} else if (groupFirstRow[collapsedGroup] === row.id) {
			// we shall keep this row event if it is collapsed, cause its first row
			Object.assign(row, {
				collapsedColumnIndex,
			})
			newRow = row
		}

		if (newRow && newRow?.subRows?.length) {
			newRow.subRows = newRow.subRows
				.map(handleRow)
				.filter(Boolean) as Row<TData>[]
		}

		return newRow
	}

	return {
		rows: rowModel.rows.map(handleRow).filter(Boolean) as Row<TData>[],
		flatRows: rowModel.flatRows,
		rowsById: rowModel.rowsById,
	}
}
