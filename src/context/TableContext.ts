import {
	ColumnOrderState,
	GroupingState,
	TableState as TanstackTableState,
} from '@tanstack/react-table'
import { createContext } from 'react'

import {
	Table_Cell,
	Table_Column,
	Table_FilterOption,
	Table_Row,
	TableComponentProps,
	TableInstance,
} from '../TableComponent'

export type TableComponentState<TData extends Record<string, any> = {}> =
	TanstackTableState & {
		columnFilterFns: {
			[key: string]: Table_FilterOption
		}
		columnOrder: ColumnOrderState | undefined
		draggingColumn: Table_Column<TData> | null
		draggingRows: Table_Row<TData>[]
		editingCell: Table_Cell<TData> | null
		editingRow: Table_Row<TData> | null
		globalFilterFn: Table_FilterOption
		grouping: GroupingState
		hoveredColumn: Table_Column<TData> | { id: string } | null
		hoveredRow: Table_Row<TData> | { id: string } | null
		isFullScreen: boolean
		showAlertBanner: boolean
		showColumnFilters: boolean
		showGlobalFilter: boolean
		showToolbarDropZone: boolean
	}

export type TableContextType = {
	table: TableInstance
	state: TableComponentState
	config: TableComponentProps
}
export const TableContext = createContext<TableContextType>(
	{} as TableContextType
)
