import { VirtualItem } from '@tanstack/react-virtual'

export type MappedVirtualItem<T> = [T, VirtualItem | undefined]
export const mapVirtualItems = <T>(
	items?: T[],
	virtualItems?: VirtualItem[]
): MappedVirtualItem<T>[] => {
	if (!items) return []
	if (!virtualItems) return items.map((col) => [col, undefined])

	return virtualItems.map((col) => [items[col.index], col])
}
