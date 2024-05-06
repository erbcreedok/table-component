import { getCollapsedMultirowColIds } from './getCollapsedMultirowColIds'

export type EmptyColumn = {
	empty: true
	keyName: string
	collapsedColumns: string[]
	colSpan: number
}

export type NonCollapsedItem<T> = (T & { empty: false }) | EmptyColumn

export const getNonCollapsedColumnItems = <T>(
	items: T[],
	collapsedMultirow: { id: string; colIds: string[] }[],
	getColumn: (item: T) => { id: string } = (item) => item as { id: string }
): NonCollapsedItem<T>[] => {
	const collapsedMultirowColIds = getCollapsedMultirowColIds(collapsedMultirow)
	let collapsedMultirowGroup = ''

	if (collapsedMultirow.length === 0)
		return items.map((item) => ({ ...item, empty: false }))

	const result = items.reduce((acc, curr) => {
		const column = getColumn(curr)
		if (collapsedMultirowColIds.includes(column.id)) {
			const multirowGroup = collapsedMultirow.find((mult) =>
				mult.colIds.includes(column.id)
			)

			if (!multirowGroup) {
				return acc
			}

			if (
				collapsedMultirowGroup &&
				collapsedMultirowGroup === multirowGroup?.id
			) {
				return acc
			}
			collapsedMultirowGroup = multirowGroup?.id ?? ''

			const emptyElement = {
				empty: true as const,
				keyName: multirowGroup?.id,
				collapsedColumns: multirowGroup?.colIds,
				colSpan: 1,
			}
			const el = emptyElement
			acc.push(el)

			return acc
		}

		collapsedMultirowGroup = ''
		acc.push({
			...curr,
			empty: false,
		})

		return acc
	}, [] as ((T & { empty: false }) | EmptyColumn)[])

	return result
}
