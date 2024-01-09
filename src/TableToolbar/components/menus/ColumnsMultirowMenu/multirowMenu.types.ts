import { RequiredKeys } from '@tanstack/table-core'

import {
	Table_Column,
	MultirowColumn,
	TableData,
} from '../../../../TableComponent'

export type MultirowColumnDef = RequiredKeys<
	Partial<MultirowColumn>,
	'id' | 'text' | 'colIds'
>
export type MultirowColumnParent<TData extends TableData = TableData> =
	MultirowColumnDef & {
		parent?: MultirowColumnParent<TData> | null
		children?: MultirowColumnParent<TData>[] | null
		columns?: Table_Column<TData>[]
	}
