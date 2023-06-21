import { Table_Row } from '../TableComponent'

export function getIsRowCollapsed({
	row,
	groupsCollapsed,
}: {
	row: Table_Row
	groupsCollapsed: string[]
}) {
	if (groupsCollapsed?.length) {
		return groupsCollapsed.some((collapsedGroup) => {
			const groups = collapsedGroup.split('>')

			return groups.every((group) => {
				const [colId, colValue] = group.split(':')

				return row.original[colId] === colValue
			})
		})
	}

	return false
}
