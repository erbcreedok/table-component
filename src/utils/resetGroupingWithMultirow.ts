import { TableInstance } from '..'

export const resetGroupingWithMultirow = <TData>(
	table: TableInstance<TData>
) => {
	const { getState, resetGrouping, setCollapsedMultirow } = table

	const { grouping, collapsedMultirow } = getState()

	for (const groupedColumn of grouping) {
		const collapsedMultirowExcludeIndex = collapsedMultirow.findIndex((mult) =>
			mult.originalColIds?.includes(groupedColumn)
		)

		if (collapsedMultirowExcludeIndex !== -1) {
			const newCollapsedMultirowData = [...collapsedMultirow]
			newCollapsedMultirowData.splice(collapsedMultirowExcludeIndex, 1)

			setCollapsedMultirow(newCollapsedMultirowData)
		}
	}

	resetGrouping(true)
}
