import { Table_Row, TableData } from '../TableComponent'

export const getTargetGroupingKeysValues = <TData extends TableData = {}>(
	targetRow?: Table_Row<TData>,
	grouping: string[] = []
) => {
	if (targetRow) {
		return grouping.reduce((result, current) => {
			result[current] = targetRow.getValue(current)

			return result
		}, {} as Record<string, unknown>)
	}

	return null
}
