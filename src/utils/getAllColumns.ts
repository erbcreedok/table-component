import { memo } from '@tanstack/table-core'

import { TableData, TableInstance } from '../TableComponent'

export const getAllColumns = <TData extends TableData = {}>(
	table: TableInstance<TData>,
	_getAllColumns: typeof table._getAllColumns
) =>
	memo(
		() => [_getAllColumns()],
		(columns) => {
			columns.forEach((column) => {
				Object.assign(column, {
					getIsVisible: () => {
						return (
							(!column.columnDef.notDisplayed &&
								table.getState().columnVisibility?.[column.id]) ??
							true
						)
					},
					getPinnedIndex: () => {
						const { columnPinning, grouping } = table.getState()
						const position = column.getIsPinned()
						if (!columnPinning || !position) return 0
						let positionPinning = columnPinning[position]!
						if (position === 'right') {
							positionPinning = positionPinning.filter(
								(d) => !grouping?.includes(d)
							)
						}

						return positionPinning.indexOf(column.id) ?? -1
					},
				})
			})

			return columns
		},
		{
			key: 'getAllColumns',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
