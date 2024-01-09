import { MultirowHeaderRow } from '../TableComponent'

export const getMultirowHeaderGroupLeafColumnIds = (
	multirowHeaderRow: MultirowHeaderRow
) =>
	multirowHeaderRow.columns.reduce(
		(acc, col) => [...acc, ...col.columnIds],
		[] as string[]
	)
