import { Column, Table } from '@tanstack/react-table'
import { buildHeaderGroups as _buildHeaderGroups } from '@tanstack/table-core'

import {
	Table_Column,
	Table_HeaderGroup,
	TableData,
	TableInstance,
} from '../TableComponent'

// Function is copy for original buildTableHeaderGroups from tanstack/table-core
// Its only needed to improve types
export function buildTableHeaderGroups<TData extends TableData = TableData>(
	allColumns: Table_Column<TData>[],
	columnsToGroup: Table_Column<TData>[],
	table: TableInstance<TData>,
	headerFamily?: 'center' | 'left' | 'right'
): Table_HeaderGroup<TData>[] {
	return _buildHeaderGroups(
		allColumns as Column<TData>[],
		columnsToGroup as Column<TData>[],
		table as unknown as Table<TData>,
		headerFamily
	) as Table_HeaderGroup<TData>[]
}
