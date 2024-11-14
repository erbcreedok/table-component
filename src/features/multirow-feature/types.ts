import {
	Table_Cell,
	Table_Column,
	Table_Header,
	TableData,
} from '../../TableComponent'
import { NonCollapsedItem } from '../../utils/getNonCollapsedColumnItems'

export type CollapsedMultirowItem = {
	id: string
	colIds: string[]
	originalColIds: string[]
}

export type CollapsedMultirowState = {
	collapsedMultirow: CollapsedMultirowItem[]
}

export type CollapsedMultirowTableInstance<TData = TableData> = {
	getNonCollapsedColumns: () => NonCollapsedItem<Table_Column<TData>>[]
	getNonCollapsedLeafHeaders: () => NonCollapsedItem<Table_Header<TData>>[]
}

export type CollapsedMultirowHeaderGroup<TData = TableData> = {
	getNonCollapsedHeaders: () => NonCollapsedItem<Table_Header<TData>>[]
}
export type CollapsedMultirowRow<TData> = {
	getNonCollapsedCells: () => NonCollapsedItem<Table_Cell<TData>>[]
}
