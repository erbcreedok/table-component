import { Table_Row, TableInstance } from '../TableComponent'

export const getGroupedRowCount = (
	row: Table_Row<{}>,
	table: TableInstance
) => {
	const visibleRows = table.getPaginationRowModel().rows
	const visibleRowIds = visibleRows.map((r) => r.id)

	const findLeafSubRows = (row): Table_Row[] => {
		if (!row.subRows || row.subRows.length === 0) {
			return [row]
		}

		if (!row?.getIsExpanded?.()) {
			return [row]
		}

		const leafSubRows: Table_Row[] = [row]
		for (const subRow of row.subRows) {
			if (subRow?.id && visibleRowIds.includes(subRow.id)) {
				const subRowLeafs = findLeafSubRows(subRow) ?? []
				if (subRowLeafs.length > 0) {
					leafSubRows.push(...subRowLeafs)
				} else {
					leafSubRows.push(subRow)
				}
			}
		}

		return leafSubRows
	}

	return findLeafSubRows(row)
}
