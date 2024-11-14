import { TeamMember } from '../types/TeamMember'

function isChildOf(child: TeamMember, parent: TeamMember) {
	return !!(parent.subRows ?? []).find((row) => {
		if (row.id === child.id) return true
		return isChildOf(child, row)
	})
}
function removeItem(item: TeamMember, items: TeamMember[], targetItem: TeamMember) {
	items.forEach((_item, index) => {
		if (_item.id === item.id) {
			if (isChildOf(targetItem, _item)) {
				items.splice(index, 1, ...(item.subRows ?? []))
				item.subRows = []
			} else {
				items.splice(index, 1)
			}
		} else if (_item.subRows) {
			removeItem(item, _item.subRows!, targetItem)
		}
	})
}
export function insertTeamMemberRows(
	draggingRows: TeamMember[],
	hoveredRow: TeamMember,
	placement: 'top' | 'bottom',
	rootItems: TeamMember[],
	asChild?: boolean
): TeamMember[] {
	// Create a deep copy of rootItems to avoid directly mutating the state
	const newRootItems = [...rootItems]

	draggingRows.forEach((draggingRow) => {
		removeItem(draggingRow, newRootItems, hoveredRow)
	})

	// Function to find the parent of a row and the index within the parent's subRows
	const findParentAndIndex = (
		target: TeamMember,
		items: TeamMember[],
		parent: TeamMember | null = null
	): { parent: TeamMember | null; index: number } => {
		for (let i = 0; i < items.length; i++) {
			const item = items[i]
			if (item.id === target.id) {
				return { parent, index: i }
			}
			if (item.subRows) {
				const result = findParentAndIndex(target, item.subRows, item)
				if (result.parent) return result
			}
		}
		return { parent: null, index: items.length - 1 }
	}

	const { parent, index } = findParentAndIndex(hoveredRow, newRootItems)

	if (placement === 'bottom') {
		if (parent) {
			if (!parent.subRows) {
				parent.subRows = []
			}
			if (asChild) {
				parent.subRows[index].subRows = [
					...draggingRows,
					...(parent.subRows[index].subRows || []),
				]
			} else {
				parent.subRows.splice(index + 1, 0, ...draggingRows)
			}
		} else if (index >= 0) {
			// If there's no parent, it means hoveredRow is at the root level
			if (asChild) {
				newRootItems[index].subRows = [
					...draggingRows,
					...(newRootItems[index].subRows || []),
				]
			} else {
				newRootItems.splice(index + 1, 0, ...draggingRows)
			}
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
