import { getCollapsedMultirowColIds } from './getCollapsedMultirowColIds'

export type EmptyColumn = {
	empty: true
	keyName: string
	collapsedColumns: string[]
	colSpan: number
}

export const getNonCollapsedColumns = <T>(
	items: T[],
	collapsedMultirow: { id: string; colIds: string[] }[],
	keyToId = 'column'
): ((T & { empty: false }) | EmptyColumn)[] => {
	const collapsedMultirowColIds = getCollapsedMultirowColIds(collapsedMultirow)
	let collapsedMultirowGroup = ''

	const result = items.reduce((acc, curr) => {
		if (collapsedMultirowColIds.includes(curr[keyToId].id)) {
			const multirowGroup = collapsedMultirow.find((mult) =>
				mult.colIds.includes(curr[keyToId].id)
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
