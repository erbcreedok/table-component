import { useCallback, useState } from 'react'
import {
	GetRowDragValuesChangeMessageProp,
	MuiTableBodyRowDragHandleFnProps,
	Table_Row,
} from '../../TableComponent'
import { UnitTreeItem } from '../types/TeamMember'
import { getUnitTreeItems, isUnitTreeItem } from './getTeamMembers'
import { reorderMembersInUnits } from './reorderMembersInUnits'

export const useHierarchyProps = () => {
	const [data, setData] = useState(getUnitTreeItems(3, 10))
	const getRowDragValuesChangeMessage = useCallback<
		GetRowDragValuesChangeMessageProp<UnitTreeItem>
	>(({ current, hoveredRow, draggingRows }) => {
		if (!hoveredRow) return current
		const getIsSameUnit = (
			rowA: Table_Row<UnitTreeItem>,
			rowB: Table_Row<UnitTreeItem>
		) => rowA.original.getParent() === rowB.original.getParent()
		const isSameUnit = draggingRows.every((row) =>
			getIsSameUnit(row, hoveredRow.row)
		)
		const isUnit = isUnitTreeItem(hoveredRow.row.original)

		if (isUnit) {
			return [
				{
					label: 'Unit',
					value: hoveredRow.row.original.name,
				},
				...current,
			]
		}

		if (!isSameUnit) {
			return [
				{
					label: 'Unit',
					value: hoveredRow.row.original.getParent()?.name ?? 'N/A',
				},
				...current,
			]
		}
		return current
	}, [])
	const muiTableBodyRowDragHandleProps = useCallback<
		MuiTableBodyRowDragHandleFnProps<UnitTreeItem>
	>(
		({ table }) => ({
			onDragEnd: () => {
				const { draggingRows, hoveredRow, grouping } = table.getState()
				if (
					hoveredRow?.row &&
					'original' in hoveredRow.row &&
					draggingRows.length > 0
				) {
					// Modify draggingRows original values to take values from the grouped columns of hoveredRow
					const targetValues = hoveredRow.row.original
					draggingRows.forEach((draggingRow) => {
						for (const columnId of grouping) {
							draggingRow.original[columnId] = targetValues[columnId]
						}
					})

					setData(
						reorderMembersInUnits(
							draggingRows.map((row) => row.original),
							hoveredRow.row.original,
							data,
							hoveredRow.position
						)
					)
				}
			},
		}),
		[]
	)

	return {
		data,
		setData,
		getRowDragValuesChangeMessage,
		muiTableBodyRowDragHandleProps,
	}
}
