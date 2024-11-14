import { memo } from '@tanstack/table-core'

import { Table_Row } from '../TableComponent'

export const getVisibleCells = <TData>(row: Table_Row<TData>) =>
	memo(
		() => [row._getAllVisibleCells()],
		(cells) => cells,
		{ key: 'getVisibleCells' }
	)
