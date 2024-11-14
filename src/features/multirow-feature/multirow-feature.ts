import { TableFeature } from '@tanstack/table-core'

import { getHeaderGroupsWithCollapseMultirow } from './get-header-groups-with-collapse-multirow'
import { getNonCollapsedCells } from './get-non-collapsed-cells'
import { getNonCollapsedColumns } from './get-non-collapsed-columns'
import { getNonCollapsedLeafHeaders } from './get-non-collapsed-leaf-headers'
import { CollapsedMultirowState } from './types'

export const multirowFeature: TableFeature = {
	getInitialState(state): CollapsedMultirowState {
		return {
			...state,
			collapsedMultirow: [],
		}
	},
	createTable(table) {
		const _getHeaderGroups = table.getHeaderGroups
		table.getNonCollapsedColumns = getNonCollapsedColumns(table) as any
		table.getNonCollapsedLeafHeaders = getNonCollapsedLeafHeaders(table) as any
		table.getHeaderGroups = getHeaderGroupsWithCollapseMultirow(
			table,
			_getHeaderGroups
		)
	},
	createRow(row, table) {
		row.getNonCollapsedCells = getNonCollapsedCells(row, table) as any
	},
}
