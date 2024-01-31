import { VirtualItem, Range } from '@tanstack/react-virtual'

export const mapVirtualItems = <T>(
	items?: T[],
	virtualItems?: VirtualItem[]
): [T, VirtualItem | undefined][] => {
	if (!items) return []
	if (!virtualItems) return items.map((col) => [col, undefined])

	return virtualItems.map((col) => [items[col.index], col])
}

/** Same as defaultRangeExtractor but returns indexes from given array instead of sequential numbers. */
export const indexesRangeExtractor = (
	range: Range,
	indexes: readonly number[]
) => {
	const start = Math.max(range.startIndex - range.overscan, 0)
	const end = Math.min(range.endIndex + range.overscan, range.count - 1)

	const result: number[] = []

	for (let i = start; i <= end; i++) {
		result.push(indexes[i])
	}

	return result
}
