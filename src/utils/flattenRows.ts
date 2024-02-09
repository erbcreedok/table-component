import { Row } from '@tanstack/react-table'
import { RowData } from '@tanstack/table-core'

type Mutate<TData extends RowData = RowData> = (
	row: Row<TData>,
	parent?: Row<TData>
) => Row<TData>
export const flattenRows = <TData extends RowData = RowData>(
	rows: Row<TData>[],
	mutate?: Mutate<TData>
) => {
	const flatRows: Row<TData>[] = []
	const handleRow = (originalRow: Row<TData>, parent?: Row<TData>) => {
		const row = mutate?.(originalRow, parent) ?? originalRow
		flatRows.push(row)
		if (row.subRows?.length) {
			row.subRows.forEach((r) => handleRow(r, row))
		}
	}
	rows.forEach((row) => handleRow(row))

	return flatRows
}
