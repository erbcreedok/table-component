import { VirtualItem } from '@tanstack/react-virtual'

export const mapVirtualItems = <T>(
	items?: T[],
	virtualItems?: VirtualItem[]
): [T, VirtualItem | undefined][] => {
	if (!items) return []
	if (!virtualItems) return items.map((col) => [col, undefined])

	return virtualItems.map((col) => [items[col.index], col])
}
