import { RequiredKeys } from '@tanstack/table-core'

import {
	MultirowColumn,
	Table_Column,
	TableData,
} from '../../../../TableComponent'

export type MultirowColumnDef = RequiredKeys<
	Partial<MultirowColumn>,
	'id' | 'text' | 'colIds'
>
export type MultirowColumnParent<TData = TableData> = MultirowColumnDef & {
	parent?: MultirowColumnParent<TData> | null
	children?: MultirowColumnParent<TData>[] | null
	columns?: Table_Column<TData>[]
}
