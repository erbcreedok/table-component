/* eslint-disable consistent-return,no-prototype-builtins,default-param-last */
import { Row, Table } from '@tanstack/react-table'
import { createRow, memo, RowData, RowModel } from '@tanstack/table-core'

import {
	GroupCollapsed,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { flattenRows } from './flattenRows'

declare module '@tanstack/table-core' {
	interface Row<TData extends RowData = RowData> {
		groupIds: Record<string, string>
		groupRows: Record<string, Row<TData>>
		getParent: () => Row<TData> | undefined
		isMock?: boolean
	}
}

function createMockRow<TData extends RowData>(
	row: Row<TData>,
	groupId: string,
	table: Table<TData>
) {
	const _row = createRow<TData>(
		table,
		`mock-${groupId}-${row.id}`,
		row.original,
		row.index,
		row.depth,
		[]
	)
	Object.assign(_row, {
		isMock: true,
		getParent: row.getParent,
	})

	return _row
}

function groupBy<TData extends RowData>(rows: Row<TData>[], columnId: string) {
	const groupMap = new Map<any, Row<TData>[]>()

	return rows.reduce((map, row) => {
		const resKey = row.getValue(columnId)
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
					// string - for not grouped parent rows
					// [string, unknown] - for grouped parent rows
					// first value is columnId, second is groupedValue
					parentPath: (string | [string, unknown])[] = [],
					parentGroupValues: {
						groupIds: Record<string, string>
						groupRows: Record<string, Row<TData>>
					} = { groupIds: {}, groupRows: {} }
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
								subRows: groupUpRecursively(
									row.subRows,
									depth,
									[...parentPath, row.id],
									parentGroupValues
								),
							}
						}

						return row
					})
					// Grouping depth has been met
					// Stop grouping and simply rewrite thd depth and row relationships
					if (depth >= existingGrouping.length) {
						return groupableRows.map((row) => {
							groupedFlatRows.push(row)
							groupedRowsById[row.id] = row

							return row
						})
					}

					const columnId = existingGrouping[depth]

					// Group the rows together for this level
					const flattenGroupableRows = flattenRows(groupableRows).map((row) => {
						return {
							...row,
							subRows: [],
							getCanExpand: () => false,
						}
					})
					const rowGroupsMap = groupBy(flattenGroupableRows, columnId)

					// Perform aggregations for each group
					const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
						([groupingValue, groupedRows], index) => {
							const path = [
								...parentPath,
								[columnId, groupingValue] as [string, unknown],
							]
							const id = JSON.stringify(path)
							const existingRows = new Map<string, Row<TData>>()
							const groupedTree: Row<TData>[] = []
							const groupRow = createRow(
								table,
								id,
								groupedRows[0].original,
								index,
								depth
							)
							const groupValues = {
								groupIds: { ...parentGroupValues.groupIds, [columnId]: id },
								groupRows: { ...parentGroupValues.groupRows, [id]: groupRow },
							}

							const localRows = groupUpRecursively(
								groupedRows,
								depth + 1,
								path,
								groupValues
							)
							Object.assign(groupRow, { subRows: localRows })
							localRows.forEach((row) => {
								row.groupIds = row.groupIds ?? {}
								row.groupRows = row.groupRows ?? {}
								Object.assign(row.groupIds, groupValues.groupIds)
								Object.assign(row.groupRows, groupValues.groupRows)
							})
							const traverse = (row: Row<TData>) => {
								const parent = row.getParent()
								const isParentGroupable = parent
									? !!opt?.isGroupableRow?.(parent as any)
									: true
								if (!parent || !isParentGroupable) {
									existingRows.set(row.id, row)
									groupedTree.push(row)
								} else {
									if (!existingRows.has(parent.id)) {
										const mockParent = createMockRow(parent, id, table)
										groupedRowsById[mockParent.id] = mockParent
										mockParent.groupIds = groupValues.groupIds
										mockParent.groupRows = groupValues.groupRows
										existingRows.set(parent.id, mockParent)
										traverse(mockParent)
									}
									const currentParent = existingRows.get(parent.id)
									if (currentParent && currentParent.subRows) {
										currentParent.subRows.push(row)
										currentParent.getCanExpand = () => true
										existingRows.set(row.id, row)
									}
								}
							}
							localRows.forEach(traverse)

							return groupedTree
						}
					)

					return [...aggregatedGroupedRows.flat(), ...notGroupableRows]
				}

				const groupedRows = groupUpRecursively(rowModel.rows)

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
