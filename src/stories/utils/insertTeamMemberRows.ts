import { TeamMember } from '../types/TeamMember'

function removeItem(item: TeamMember, items: TeamMember[]) {
	items.forEach((_item, index) => {
		if (_item.id === item.id) {
			items.splice(index, 1)
		} else if (_item.subRows) {
			removeItem(item, _item.subRows!)
		}
	})
}
export function insertTeamMemberRows(
	draggingRows: TeamMember[],
	hoveredRow: TeamMember,
	placement: 'top' | 'bottom',
	rootItems: TeamMember[]
): TeamMember[] {
	// Create a deep copy of rootItems to avoid directly mutating the state
	const newRootItems = [...rootItems]

	draggingRows.forEach((draggingRow) => {
		removeItem(draggingRow, newRootItems)
	})

	// Function to find the parent of a row and the index within the parent's subRows
	const findParentAndIndex = (
		item: TeamMember,
		items: TeamMember[],
		parent: TeamMember | null = null
	): { parent: TeamMember | null; index: number } => {
		for (let i = 0; i < items.length; i++) {
			const _item = items[i]
			if (_item.id === item.id) {
				return { parent, index: i }
			}
			if (_item.subRows) {
				const result = findParentAndIndex(item, _item!.subRows!, _item)
				if (result) return result
			}
		}
		return { parent: null, index: -1 }
	}

	const { parent, index } = findParentAndIndex(hoveredRow, newRootItems)

	if (placement === 'bottom') {
		if (parent) {
			if (!parent.subRows) {
				parent.subRows = []
			}
			parent.subRows[index].subRows = [
				...draggingRows,
				...(parent.subRows[index].subRows || []),
			]
		} else {
			// If there's no parent, it means hoveredRow is at the root level
			newRootItems[index].subRows = [
				...draggingRows,
				...(newRootItems[index].subRows || []),
			]
		}
	} else if (placement === 'top') {
		// Add draggingRows one index above hoveredRow in the same depth
		if (parent) {
			parent.subRows!.splice(index, 0, ...draggingRows)
		} else {
			// If there's no parent, it means hoveredRow is at the root level
			newRootItems.splice(index, 0, ...draggingRows)
		}
	}

	return newRootItems
}
