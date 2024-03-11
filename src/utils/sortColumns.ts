import {
	Table_Cell,
	Table_Column,
	Table_Header,
	TableData,
} from '../TableComponent'

import { sortArrayBy } from './sortArrayBy'
import { MappedVirtualItem } from './virtual'

export const getColumnFromHeader = <TData extends TableData = TableData>([
	col,
]: MappedVirtualItem<Table_Header<TData>>) => col.column
export const getColumnFromCell = <TData extends TableData = TableData>([
	col,
]: MappedVirtualItem<Table_Cell<TData>>) => col.column

const getCompareValue = <TData extends TableData = TableData>(
	column: Table_Column<TData>
) => {
	if (column.getIsGrouped()) {
		return -2 + column.getGroupedIndex() * 0.001
	}
	if (!column.getIsGrouped() && column.getIsPinned() === 'left') {
		return -1
	}

	return 0
}
export const sortMappedVirtualHeaders = <TData extends TableData>(
	array: MappedVirtualItem<Table_Header<TData>>[]
) => {
	return sortArrayBy(array, getColumnFromHeader, getCompareValue)
}
export const sortMappedVirtualCells = <TData extends TableData>(
	array: MappedVirtualItem<Table_Cell<TData>>[]
) => {
	return sortArrayBy(array, getColumnFromCell, getCompareValue)
}
export const sortColumns = <TData extends TableData>(
	array: Table_Column<TData>[]
) => {
	return sortArrayBy(array, (i) => i, getCompareValue)
}
