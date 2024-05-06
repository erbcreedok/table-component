import { memo } from '@tanstack/table-core'

import { Table_Row, TableData } from '../TableComponent'

export const getVisibleCells = <TData extends TableData = {}>(
	row: Table_Row<TData>
) =>
	memo(
		() => [row._getAllVisibleCells()],
		(cells) => cells,
		{ key: 'getVisibleCells' }
	)
