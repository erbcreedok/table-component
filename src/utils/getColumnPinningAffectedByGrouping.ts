import { ColumnPinningState, GroupingState } from '@tanstack/react-table'

import { utilColumns } from '../utilColumns'

import { splitArrayItems } from './splitArrayItems'

export const getColumnPinningAffectedByGrouping = (
	columnPinning: ColumnPinningState,
	grouping: GroupingState
) => {
	const newColumnPinning = {
		left: [...(columnPinning.left ?? [])],
		right: [...(columnPinning.right ?? [])],
	}

	// move all grouped columns to the left pinned state
	const [right, left] = splitArrayItems(
		newColumnPinning.right,
		(columnId) => !grouping.includes(columnId)
	)
	newColumnPinning.right = right
	newColumnPinning.left = [...(newColumnPinning.left ?? []), ...left]

	// ordered array for left pinned column
	// order should be: grouped columns >> utilColumn >> other
	newColumnPinning.left = [
		...new Set([...grouping, utilColumns.column, ...newColumnPinning.left]),
	].filter((colId) => newColumnPinning.left.includes(colId))

	return newColumnPinning
}
