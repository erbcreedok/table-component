import { faker } from '@faker-js/faker'
import { useCallback } from 'react'
import { Table_Row, validateAllFields } from '../../'
import { TeamMember, User } from '../types/TeamMember'

export const useEditingProps = ([data, setData]) => {
	const updateRow = useCallback(
		(row, values) => {
			const newData = [...data]
			Object.assign(row.original, mapValuesToTeamMember(row, values))
			setData(newData)
		},
		[data, setData]
	)
	const addRow = useCallback(
		(row, values) => {
			const newData = [...data]
			if (row.previousRow.depth < row.depth) {
				row.previousRow.original.subRows = [
					mapValuesToTeamMember(row, values),
					...(row.previousRow.original.subRows ?? []),
				]
			} else {
				const parentOriginal = row.previousRow.getParent()?.original
				const searchArray = parentOriginal?.subRows ?? newData
				const index = searchArray.indexOf(row.previousRow.original)
				searchArray.splice(index + 1, 0, mapValuesToTeamMember(row, values))
			}
			setData(newData)
		},
		[data, setData]
	)

	const handleEditRow = useCallback(
		({ exitEditingMode, row, values }) => {
			updateRow(row, values)
			exitEditingMode()
		},
		[updateRow]
	)
	const handleAddRow = useCallback(
		({ exitEditingMode, row, values }) => {
			addRow(row, { ...values, id: faker.datatype.uuid() })
			exitEditingMode()
		},
		[addRow]
	)
	const handleEditTable = useCallback(
		({ exitEditingMode, methods, table, values }) => {
			validateAllFields({ table, methods }).then((isValid) => {
				if (!isValid) return
				const rows = table.getCoreRowModel().flatRows
				const newData = [...data]
				const traverse = (row) => {
					const value = values[row.id]
					if (value) {
						Object.assign(row.original, mapValuesToTeamMember(row.id, value))
					}
				}
				rows.forEach(traverse)
				setData(newData)
				exitEditingMode()
			})
		},
		[]
	)

	return { handleEditRow, handleAddRow, addRow, updateRow, handleEditTable }
}

export const mapValuesToTeamMember = (
	row: Table_Row<TeamMember>,
	values: Record<string, any>
) => {
	const newRow = { ...row.original }
	for (let key in values) {
		const value = values[key]
		if (key === 'teamMember') {
			newRow.member = value as User
		} else if (key === 'completion') {
			newRow.completion =
				value !== null && value !== undefined ? Number(value) : value
		} else {
			newRow[key] = value === '' ? null : value
		}
	}

	return newRow
}
