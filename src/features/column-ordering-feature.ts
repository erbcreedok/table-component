import { TableFeature } from '@tanstack/table-core'

import { _getOrderColumnsFn } from '../utils/_getOrderColumnsFn'
import { getHeaderGroups } from '../utils/getHeaderGroups'
import { getLeafHeaders } from '../utils/getLeafHeaders'
import { getLeftLeafColumns } from '../utils/getLeftLeafColumns'

export const columnOrderingFeature: TableFeature = {
	createTable(table) {
		table._getOrderColumnsFn = _getOrderColumnsFn(table) as any
		table.getHeaderGroups = getHeaderGroups(table) as any
		table.getLeafHeaders = getLeafHeaders(table) as any
		table.getLeftLeafColumns = getLeftLeafColumns(table) as any
	},
}
