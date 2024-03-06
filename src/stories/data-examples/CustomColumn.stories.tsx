import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps, Table_ColumnDef } from '../..'

const meta: Meta = {
	title: 'Data Examples/Custom Column',
}

export default meta

interface MyRow {
	name: string
	color: 'red' | 'green' | 'blue'
	size: 'small' | 'medium' | 'large'
	customColumn1?: any
}

const initialColumns: Table_ColumnDef<MyRow>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
	},
	{
		header: 'Color',
		accessorKey: 'color',
	},
	{
		header: 'Custom Column',
		accessorKey: 'customColumn1',
		enableCustomization: true,
	},
	{
		header: 'Size',
		accessorKey: 'size',
	},
]

// prettier-ignore
const initialData: MyRow[] = [
	{name: '0',	color: 'red',	size: 'large'},
	{name: '1', color: 'blue', size: 'small'},
	{name: '2', color: 'blue', size: 'medium'},
	{name: '3', color: 'red', size: 'large'},
	{name: '4', color: 'green', size: 'small'},
]

export const CustomColumnDefault: Story<TableComponentProps> = () => {
	const [columns, setColumns] = useState(initialColumns)
	const [data, setData] = useState(initialData)

	console.log(columns, data)

	const setNewRow = (row, values) => {
		const newData = [...data]
		const newRow = newData[row.index]
		Object.entries(values).forEach(([key, value]) => {
			newRow[key] = value
		})
		newData[row.index] = newRow
		setData(newData)
	}

	const handleSaveRows = ({ exitEditingMode, rows, values }) => {
		if (Array.isArray(rows)) {
			rows.forEach((row) => {
				setNewRow(row, values)
			})
		} else {
			setNewRow(rows, values)
		}
		exitEditingMode()
	}

	return (
		<TableComponent
			columns={columns}
			setColumns={(columns, current, action) => {
				setColumns(columns)
				// If a column is deleted, you should manually delete the associated data.
				if (action === 'DELETE') {
					const key = current.accessorKey!
					setData(
						data.map((row) => {
							delete row[key]

							return row
						})
					)
				}
			}}
			data={data}
			customColumns={{
				validate: {
					header: (h) => h.length > 3 || 'Header is too short',
					shortHeader: (h) => h.length > 3 || 'Header is too short',
				},
			}}
			editingMode="row"
			enableEditing
			onEditingRowsSave={handleSaveRows}
		/>
	)
}
