import { UnitTreeItem } from "../types/TeamMember";

export function reorderMembersInUnits(
  movingMembers: UnitTreeItem[],
  targetMember: UnitTreeItem,
  data: UnitTreeItem[],
  position: 'top' | 'bottom' = 'bottom'
): UnitTreeItem[] {
  const clonedData = [...data]

  // Recursive function to find and remove moving members
  function removeMembers(unitTree: UnitTreeItem[]): void {
    for (let i = 0; i < unitTree.length; i++) {
      const unit = unitTree[i];
      if (movingMembers.includes(unit)) {
        unitTree.splice(i, 1);
        i--;  // Decrement the index since we've modified the array
        continue;  // Move to the next iteration since we found the unit
      }

      if (unit.subRows) {
        removeMembers(unit.subRows as UnitTreeItem[]);
      }
    }
  }

  // Recursive function to find target and insert moving members
  function insertMembersAtTarget(unitTree: UnitTreeItem[]): boolean {
    for (let i = 0; i < unitTree.length; i++) {
      const unit = unitTree[i];
      if (unit === targetMember) {
        if (position === 'top') {
          unitTree.splice(i, 0, ...movingMembers);
        } else {
          unitTree.splice(i + 1, 0, ...movingMembers);
        }
        return true;  // Indicate that the insert was successful
      }

      if (unit.subRows && insertMembersAtTarget(unit.subRows as UnitTreeItem[])) {
        return true;  // If inserted in subRows, stop the further search
      }
    }
    return false;  // Indicate that the insert wasn't done
  }

  removeMembers(clonedData);
  insertMembersAtTarget(clonedData);

  return clonedData;
}
