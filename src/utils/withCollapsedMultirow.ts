import { memo } from '@tanstack/table-core'

import {
	Table_HeaderGroup,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { buildTableHeaderGroups } from './buildTableHeaderGroups'
import { getNonCollapsedColumnItems } from './getNonCollapsedColumnItems'

export const withCollapsedMultirow = <TData extends TableData = {}>(
	table: TableInstance<TData>
) => {
	Object.assign(table, {
		getNonCollapsedColumns: getNonCollapsedColumns(table),
		getNonCollapsedLeafHeaders: getNonCollapsedLeafHeaders(table),
		getHeaderGroups: getHeaderGroupsWithCollapseMultirow(table),
	})
}

const getNonCollapsedColumns = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) =>
	memo(
		() => [table.getVisibleLeafColumns(), table.getState().collapsedMultirow],
		(columns, collapsedMultirow) =>
			getNonCollapsedColumnItems(columns, collapsedMultirow),
		{
			key: 'getNonCollapsedColumns',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)

const getNonCollapsedLeafHeaders = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) =>
	memo(
		() => [table.getLeafHeaders(), table.getState().collapsedMultirow],
		(headerGroups, collapsedMultirow) =>
			getNonCollapsedColumnItems(
				headerGroups,
				collapsedMultirow,
				(header) => header.column
			),
		{
			key: 'getNonCollapsedLeafHeaders',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)

const getHeaderGroupsWithCollapseMultirow = <TData extends TableData = {}>(
	table: TableInstance<TData>
) =>
	memo(
		() => [table.getAllColumns(), table.getVisibleLeafColumns()],
		(allColumns, visibleLeafColumns) =>
			buildTableHeaderGroups(allColumns, visibleLeafColumns, table).map(
				(headerGroup) => {
					headerGroup.getNonCollapsedHeaders = getNonCollapsedHeaders(
						headerGroup,
						table
					)

					return headerGroup
				}
			),
		{
			key: 'getHeaderGroupsWithCollapseMultirow',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)

const getNonCollapsedHeaders = <TData extends TableData = {}>(
	headerGroup: Table_HeaderGroup<TData>,
	table: TableInstance<TData>
) =>
	memo(
		() => [headerGroup, table.getState().collapsedMultirow],
		(headerGroup, collapsedMultirow) =>
			getNonCollapsedColumnItems(headerGroup.headers, collapsedMultirow),
		{
			key: 'getNonCollapsedHeaders',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)

export const getNonCollapsedCells = <TData extends TableData = {}>(
	row: Table_Row<TData>,
	table: TableInstance<TData>
) =>
	memo(
		() => [row.getVisibleCells(), table.getState().collapsedMultirow],
		(visibleCells, collapsedMultirow) => {
			return getNonCollapsedColumnItems(
				visibleCells,
				collapsedMultirow,
				(cell) => cell.column
			)
		},
		{
			key: 'getNonCollapsedCells',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
