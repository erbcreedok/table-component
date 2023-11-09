import { getColumnId } from '../column.utils'
import { Table_Column, TableData } from '../TableComponent'

export const getSuggestedColumns = <TData extends TableData = TableData>(
	columns: Table_Column<TData>[],
	suggested?: readonly string[]
): [Table_Column<TData>[], boolean] => {
	if (suggested) {
		const result = columns.filter((col) =>
			suggested.includes(getColumnId(col.columnDef))
		)

		if (result.length > 0) return [result, true]
	}

	return [columns, false]
}
