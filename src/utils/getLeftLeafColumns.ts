import { memo, Table } from '@tanstack/table-core'

export const getLeftLeafColumns = <TData>(table: Table<TData>) =>
	memo(
		() => [
			table.getAllLeafColumns(),
			table.getState().columnPinning.left,
			table.getState().grouping,
		],
		(allColumns, left, grouping) => {
			return (left ?? [])
				.map((columnId) => allColumns.find((column) => column.id === columnId)!)
				.sort((a, b) => {
					const aIndex = grouping.findIndex((group) => group === a.id)
					const bIndex = grouping.findIndex((group) => group === b.id)

					if (aIndex === -1 && bIndex === -1) return 0
					if (aIndex === -1) return 1
					if (bIndex === -1) return -1

					return aIndex - bIndex
				})
				.filter(Boolean)
		},
		{
			key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
			debug: () => table.options.debugAll ?? table.options.debugColumns,
		}
	)
