import { Table_Row } from '../TableComponent'

export const getTargetGroupingKeysValues = <TData>(
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
