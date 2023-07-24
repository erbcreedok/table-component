import { Table_Row } from '../TableComponent'

export function getSubRowIndex({ row }: { row: Table_Row }) {
	const parentRow = row.getParent?.()

	return parentRow?.subRows?.findIndex((pR) => pR.id === row.id)
}
