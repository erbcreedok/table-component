import {
	Table_CellOrEmpty,
	Table_Column,
	Table_ColumnOrEmpty,
	Table_HeaderOrEmpty,
	TableData,
} from '../TableComponent'

import { sortArrayBy } from './sortArrayBy'
import { MappedVirtualItem } from './virtual'

export const getColumnFromHeaderOrCell = <TData extends TableData = TableData>([
	col,
]: MappedVirtualItem<
	Table_HeaderOrEmpty<TData> | Table_CellOrEmpty<TData>
>) => {
	if (col.empty) {
		return col
	}

	return col.column
}

const getCompareValue = <TData extends TableData = TableData>(
	column: Table_ColumnOrEmpty<TData>
) => {
	if (column.empty) {
		return 0
	}
	if (column.getIsGrouped()) {
		return -2 + column.getGroupedIndex() * 0.001
	}
	if (!column.getIsGrouped() && column.getIsPinned() === 'left') {
		return -1
	}

	return 0
}
export const sortMappedVirtualHeaders = <TData extends TableData>(
	array: MappedVirtualItem<Table_HeaderOrEmpty<TData>>[]
) => {
	return sortArrayBy(array, getColumnFromHeaderOrCell, getCompareValue)
}
export const sortMappedVirtualCells = <TData extends TableData>(
	array: MappedVirtualItem<Table_CellOrEmpty<TData>>[]
) => {
	return sortArrayBy(array, getColumnFromHeaderOrCell, getCompareValue)
}
export const sortColumns = <TData extends TableData>(
	array: Table_Column<TData>[]
) => {
	return sortArrayBy(array, (i) => i, getCompareValue)
}
