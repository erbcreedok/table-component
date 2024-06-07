import { Table_Row, TableData, TableInstance } from '../TableComponent'

export const showRowInTable = <TData extends TableData = {}>(
	_row: Table_Row<TData>,
	table: TableInstance<TData>
) =>
	table.options.showRowInTable
		? () => table.options.showRowInTable?.(_row, table)
		: () => {
				const row = table.getPrePaginationRowModel().rowsById[_row.id]
				if (!row) {
					console.error(`Row not with id ${_row.id} found in table model`)

					return
				}
				const { expanded, groupCollapsed } = table.getState()
				if (expanded) {
					// Ensure all parent rows/groups of this row are expanded
					let currentRow: Table_Row<TData> | undefined = row
					while (currentRow && currentRow.depth > 0) {
						currentRow = currentRow.getParent()
						if (!currentRow) {
							break
						}
						if (!currentRow.getIsExpanded()) {
							currentRow.toggleExpanded()
						}
					}
				}
				if (groupCollapsed) {
					// Ensure all parent groups of this row are expanded
					const groupIds: string[] = Object.values(row.groupIds ?? [])
					const shouldChangeState = Object.entries(groupCollapsed).some(
						([groupId, isCollapsed]) =>
							groupIds.includes(groupId) && isCollapsed
					)
					if (shouldChangeState) {
						table.setGroupCollapsed((prev) =>
							groupIds.reduce(
								(acc, groupId) => ({ ...acc, [groupId]: false }),
								prev
							)
						)
					}
				}

				queueMicrotask(() => {
					// should get new index, because row could change its index after state manipulations
					const index = table
						.getPrePaginationRowModel()
						.flatRows.findIndex((r) => r.id === _row.id)
					const pagination = table.getState().pagination
					const pageIndex = Math.floor(index / pagination.pageSize)
					if (index === -1 || pageIndex === pagination.pageIndex) {
						return
					}

					table.setPagination((prev) => ({
						...prev,
						pageIndex,
					}))
				})
		  }
