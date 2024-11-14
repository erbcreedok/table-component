import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../..'

const meta: Meta = {
	title: 'Data Examples/Custom Column',
}

export default meta

interface MyRow {
	name: string
	color: 'red' | 'green' | 'blue'
	size: 'small' | 'medium' | 'large'
	customText?: any
	customNumber?: any
	customPercent?: any
}

const initialColumns: Table_ColumnDef<MyRow>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
	},
	{
		header: 'Custom Text',
		accessorKey: 'customText',
		enableCustomization: true,
		dataType: 'textual',
		editVariant: 'text',
	},
	{
		header: 'Custom Number',
		accessorKey: 'customNumber',
		enableCustomization: true,
		dataType: 'numeric',
		editVariant: 'number',
		decimalPlaces: 2,
		displayFormat: 'SPACE_1000',
	},
	{
		header: 'Custom Percent',
		accessorKey: 'customPercent',
		enableCustomization: true,
		dataType: 'percent',
		editVariant: 'percent',
		decimalPlaces: 2,
		minValue: 0,
		displayFormat: 'PROGRESS_BAR',
	},
	{
		header: 'Color',
		accessorKey: 'color',
	},
	{
		header: 'Size',
		accessorKey: 'size',
	},
]

// prettier-ignore
const initialData: MyRow[] = [
	{name: '0',	color: 'red',	size: 'large'},
	{name: '1', color: 'blue', size: 'small', customText: 'abcde'},
	{name: '2', color: 'blue', size: 'medium', customNumber: 123456.78901},
	{name: '3', color: 'red', size: 'large', customPercent: 333.333},
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

	const handleSaveRows = ({ exitEditingMode, row, values }) => {
		setNewRow(row, values)
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
					header: (h) => h.length >= 3 || 'Header is too short',
					shortHeader: (h) =>
						h === '' || h.length >= 3 || 'Header is too short',
				},
			}}
			editingMode="row"
			enableEditing
			onEditingRowSave={handleSaveRows}
			enableGrouping
		/>
	)
}
