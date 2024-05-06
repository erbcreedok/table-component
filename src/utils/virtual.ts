import { VirtualItem } from '@tanstack/react-virtual'

export type MappedVirtualItem<T> = [T, VirtualItem | undefined]
export const mapVirtualItems = <T>(
	items?: T[],
	virtualItems?: VirtualItem[]
): MappedVirtualItem<T>[] => {
	if (!items) return []
	if (!virtualItems) return items.map((col) => [col, undefined])

	return virtualItems.reduce((acc, col) => {
		if (!items[col.index]) {
			console.error(`no index ${col.index} in given array`, { col, items })
		} else {
			acc.push([items[col.index], col])
		}

		return acc
	}, [] as MappedVirtualItem<T>[])
}
