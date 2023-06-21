import { Table_Row } from '../TableComponent'

export const getColumnGroupIds = (rows: Table_Row[], columnId: string) => {
	return Array.from<string>(
		rows.reduce((acc, row) => {
			if (row.groupIds?.[columnId]) {
				acc.add(row.groupIds[columnId])
			}

			return acc
		}, new Set<string>())
	)
}
