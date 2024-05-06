import { useCallback, useLayoutEffect, useRef } from 'react'

import { TableData, TableInstance } from '../TableComponent'
import { _getOrderColumnsFn } from '../utils/_getOrderColumnsFn'
import { getAllColumns } from '../utils/getAllColumns'
import { getHeaderGroups } from '../utils/getHeaderGroups'
import { getLeafHeaders } from '../utils/getLeafHeaders'
import { getLeftLeafColumns } from '../utils/getLeftLeafColumns'
import { withCollapsedMultirow } from '../utils/withCollapsedMultirow'

export const useTableColumns = <TData extends TableData = {}>(
	table: TableInstance<TData>
) => {
	const isMounted = useRef(false)

	const setTableColumns = useCallback((table) => {
		// original get all columns is saved in _getAllColumns method
		const _getAllColumns = table._getAllColumns ?? table.getAllColumns
		Object.assign(table, {
			_getAllColumns,
			_getOrderColumnsFn: _getOrderColumnsFn(table),
			getAllColumns: getAllColumns(table, _getAllColumns),
			getHeaderGroups: getHeaderGroups(table),
			getLeafHeaders: getLeafHeaders(table),
			getLeftLeafColumns: getLeftLeafColumns(table),
		})

		withCollapsedMultirow(table)
	}, [])

	useLayoutEffect(() => {
		setTableColumns(table)
	}, [setTableColumns, table])

	if (!isMounted.current) {
		setTableColumns(table)
		isMounted.current = true
	}
}
