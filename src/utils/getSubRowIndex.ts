import { Table_Row, TableInstance } from '../TableComponent'

import { getParentRow } from './getParentRow'

export function getSubRowIndex({
	row,
	table,
}: {
	row: Table_Row
	table: TableInstance
}) {
	const parentRow = getParentRow({ row, table })

	return parentRow?.subRows?.indexOf(row)
}
