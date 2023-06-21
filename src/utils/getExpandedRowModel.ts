import { Table, Row, RowModel, RowData, memo } from '@tanstack/table-core'

import { GroupCollapsed, Table_Row, TableInstance } from '../TableComponent'

export function getExpandedRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.getState().expanded,
				(table as unknown as TableInstance).getState().groupCollapsed,
				table.getState().grouping,
				table.getGroupedRowModel(),
				table.options.paginateExpandedRows,
			],
			(expanded, groupCollapsed, grouping, rowModel, paginateExpandedRows) => {
				if (
					!rowModel.rows.length ||
					(expanded !== true && !Object.keys(expanded ?? {}).length)
				) {
					return rowModel
				}

				if (!paginateExpandedRows) {
					// Only expand rows at this point if they are being paginated
					return rowModel
				}

				return expandRows(rowModel, groupCollapsed, grouping)
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getExpandedRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
			}
		)
}

export function expandRows<TData extends RowData>(
	rowModel: RowModel<TData>,
	groupCollapsed: GroupCollapsed,
	grouping: string[]
) {
	const expandedRows: Row<TData>[] = []
	const groupFirstRow: Record<string, string> = {}

	const handleRow = (row: Row<TData>) => {
		const tableRow = row as unknown as Table_Row
		const tGroupIds = tableRow.groupIds ?? {}
		const groupIds = Object.keys(tGroupIds)
			.sort((a, b) => grouping.indexOf(a) - grouping.indexOf(b))
			.map((key) => tGroupIds[key])
		const collapsedColumnIndex = groupIds.findIndex((id) => groupCollapsed[id])
		const collapsedGroup =
			collapsedColumnIndex > -1 ? groupIds[collapsedColumnIndex] : null

		if (collapsedGroup && !groupFirstRow[collapsedGroup]) {
			groupFirstRow[collapsedGroup] = row.id
		}
		if (
			!collapsedGroup ||
			(tableRow.groupRows?.[collapsedGroup].subRows?.length ?? 2) <= 1
		) {
			delete (row as unknown as Table_Row).collapsedColumnIndex
			expandedRows.push(row)
		} else if (groupFirstRow[collapsedGroup] === row.id) {
			Object.assign(row, {
				collapsedColumnIndex,
			})
			expandedRows.push(row)
		}

		if (row.subRows?.length && row.getIsExpanded()) {
			row.subRows.forEach(handleRow)
		}
	}

	rowModel.rows.forEach(handleRow)

	return {
		rows: expandedRows,
		flatRows: rowModel.flatRows,
		rowsById: rowModel.rowsById,
	}
}
