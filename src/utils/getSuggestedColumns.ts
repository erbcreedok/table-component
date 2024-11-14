import { getColumnId } from '../column.utils'
import { Table_Column } from '../TableComponent'

export const getSuggestedColumns = (
	columns: Table_Column[],
	suggested?: readonly string[]
): [Table_Column[], boolean] => {
	if (suggested) {
		const result = columns.filter((col) => suggested.includes(getColumnId(col)))

		if (result.length > 0) return [result, true]
	}

	return [columns, false]
}
