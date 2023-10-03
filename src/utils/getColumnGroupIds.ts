import { Table_Row, TableData } from '../TableComponent'

export const getColumnGroupIds = <TData extends TableData = {}>(
	rows: Table_Row<TData>[],
	columnId: string
) => {
	return Array.from<string>(
		rows.reduce((acc, row) => {
			if (row.groupIds?.[columnId]) {
				acc.add(row.groupIds[columnId])
			}

			return acc
		}, new Set<string>())
	)
}
