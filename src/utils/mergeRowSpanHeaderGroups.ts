import { Header } from '@tanstack/table-core'

import { Table_HeaderGroup, TableData } from '../TableComponent'

import { remove2d, transpose2d } from './array2d'

export type MRSHeader = Pick<
	Header<any, any>,
	'id' | 'isPlaceholder' | 'rowSpan'
>

const merge =
	<T extends MRSHeader>(pointer?: T) =>
	(result: T[], header: T) => {
		if (header?.isPlaceholder) {
			result.unshift(undefined as any)
			pointer!.rowSpan += 1
		} else {
			result.push(header)

			if (header) {
				pointer = header
				pointer.rowSpan = 1
			}
		}

		return result
	}

export const mergeRowSpan = <T extends MRSHeader>(
	rows: readonly (readonly T[])[]
) =>
	remove2d(
		transpose2d(
			transpose2d([/* immutable */ ...rows].reverse()).map((headers) =>
				headers.reduce(merge(), [] as typeof headers)
			)
		).reverse()
	)

/**
 * Merge row span headers removing placeholders
 * This function does not make sense if there are less than 2 groups
 */
export const mergeRowSpanHeaderGroups = <TData extends TableData = TableData>(
	groups: readonly Table_HeaderGroup<TData>[]
): Table_HeaderGroup<TData>[] => {
	const result = [/* immutable */ ...groups]
	const rows = mergeRowSpan(result.map((g) => g.headers))
	const { length } = result

	for (let i = 0; i < length; i++) {
		result[i].headers = rows[i]
	}

	return result
}
