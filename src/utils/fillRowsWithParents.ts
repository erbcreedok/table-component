import { Table_Row, TableData } from '../TableComponent'

export const fillRowsWithParents = <TData extends TableData = TableData>(
	_rows: Table_Row<TData>[]
): Table_Row<TData>[] => {
	const existingRows = new Map<string, Table_Row<TData>>()
	const rows = _rows.map((row) => ({
		...row,
		subRows: [],
		getCanExpand: () => false,
	}))
	const rowsTree: Table_Row<TData>[] = []

	const traverse = (row: Table_Row<TData>) => {
		const parent = row.getParent()

		if (!parent) {
			existingRows.set(row.id, row)
			rowsTree.push(row)

			return
		}

		if (!existingRows.has(parent.id)) {
			const newParent = {
				...parent,
				subRows: [],
				isMock: true,
				id: `mock-${parent.id}`,
			}
			existingRows.set(parent.id, newParent)
			traverse(newParent)
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const currentParent = existingRows.get(parent.id)!

		if (!currentParent.subRows) {
			currentParent.subRows = []
		}

		currentParent.subRows.push(row)
		currentParent.getCanExpand = () => true
		existingRows.set(row.id, row)
	}

	rows.forEach(traverse)

	return rowsTree
}
