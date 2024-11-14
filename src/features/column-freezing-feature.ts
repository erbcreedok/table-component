import { TableFeature } from '@tanstack/table-core'

export const columnFreezingFeature: TableFeature = {
	createColumn(column, table) {
		column.getPinnedIndex = () => {
			const { columnPinning, grouping } = table.getState()
			const position = column.getIsPinned()
			if (!columnPinning || !position) return 0
			let positionPinning = columnPinning[position]!
			if (position === 'right') {
				positionPinning = positionPinning.filter((d) => !grouping?.includes(d))
			}

			return positionPinning.indexOf(column.id) ?? -1
		}
	},
}
