import { HoveredRowState, TableData, TableInstance } from '../TableComponent'

export const setHoveredRow =
	<TData extends TableData = TableData>(table: TableInstance<TData>) =>
	(hoveredRow: HoveredRowState<TData> | null) => {
		const { setHoveredRow, setGroupCollapsed } = table
		const { groupCollapsed } = table.getState()
		setHoveredRow(hoveredRow)
		const row = hoveredRow?.row
		if (row && row.groupIds) {
			const collapsedGroups = Object.values(row.groupIds).filter(
				(gId) => groupCollapsed[gId]
			)
			if (collapsedGroups.length > 0) {
				setGroupCollapsed((prev) =>
					collapsedGroups.reduce(
						(acc, gId) => ({
							...acc,
							[gId]: false,
						}),
						prev
					)
				)
			}
		}
	}
