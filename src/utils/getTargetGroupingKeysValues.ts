export const getTargetGroupingKeysValues = (targetRow, grouping) => {
	if (targetRow) {
		const groupingKeysValues = grouping.reduce((result, current) => {
			result[current] = targetRow.getValue(current)

			return result
		}, {})

		return groupingKeysValues
	}

	return null
}
