export const getDndTargetGroupingUpdateValues = (targetRow, grouping) => {
	if (targetRow) {
		const groupingKeysValues = grouping.reduce((result, current) => {
            if (current === 'teamMember') {
				result[current] = targetRow.member
            } else {
                result[current] = targetRow.getValue(current)
            }

			return result
		}, {})

		return groupingKeysValues
	}

	return null
}
