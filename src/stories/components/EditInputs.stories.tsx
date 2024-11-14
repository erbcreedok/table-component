import { Meta } from '@storybook/react'
import React, { useState } from 'react'

import TableComponent, { Table_ColumnDef } from '../../index'
import { convertDate } from '../utils/convertDate'

type EditInputsExampleData = {
	text: string
	numeric: number
	date: Date
	dateRange: Date[]
	singleSelect: string
	multiSelect: string[]
}

const commonDataItem: EditInputsExampleData = {
	text: 'Some text',
	numeric: 50,
	date: new Date('2024-01-01T00:00:00.000Z'),
	dateRange: [new Date('2024-01-01T00:00:00.000Z'), new Date('2024-01-05T00:00:00.000Z')],
	singleSelect: 'Option1',
	multiSelect: ['Option1'],
}

const initialData: EditInputsExampleData[] = new Array(1).fill({...commonDataItem})
/**
 * TODO: Add formula input
 * add more examples and/or customization with storybook props
 */
const columns: Table_ColumnDef<EditInputsExampleData>[] = [
	{
		header: 'Text field',
		accessorKey: 'text',
		dataType: 'textual',
		editVariant: 'text',
	},
	{
		header: 'Number field',
		accessorKey: 'numeric',
		dataType: 'numeric',
		editVariant: 'number',
		minValue: 0,
		maxValue: 100,
	},
	{
		header: 'Date field',
		accessorKey: 'date',
		dataType: 'date',
		editVariant: 'date',
		Cell: ({ cell }) => (
			<div>
				{convertDate(cell.getValue() as Date)}
			</div>
		)
	},
	{
		header: 'Date-Range field',
		accessorKey: 'dateRange',
		dataType: 'date',
		editVariant: 'date-range',
		Cell: ({ cell }) => {
			const dates = cell.getValue() as Date[]

			return (
				<div>
					{convertDate(dates[0])}-{convertDate(dates[1])}
				</div>
			)
		}
	},
	{
		header: 'Single-Select field',
		accessorKey: 'singleSelect',
		dataType: 'single-select',
		editVariant: 'select',
		editSelectOptions: [
			'Option1',
			'Option2',
		],
	},
	{
		header: 'Multi-Select field',
		accessorKey: 'multiSelect',
		dataType: 'multi-select',
		editVariant: 'multi-select',
		editSelectOptions: [
			'Option1',
			'Option2',
		],
	},
]

export const EditInputsExample = (args) => {
	const [data, setData] = useState(initialData)

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
			data={data}
			columns={columns}
			onEditingRowSave={handleSaveRows}
			onEditingCellSave={({ cell, value, error, exitEditingMode }) => {
				console.log(value, error, cell)
				if (error) return
				setNewRow(cell.row, { [cell.column.id]: value })
				exitEditingMode()
			}}
			enableTopToolbar={false}
			enableRowNumbers={false}
			enableEditing
			{...args}
		/>
	)
}

const meta: Meta = {
	title: 'Components/Edit Inputs Examples',
	argTypes: {
		editingMode: {
			options: ['table', 'modal', 'row', 'cell'],
			control: { type: 'select' },
			defaultValue: 'row',
		},
	}
};

export default meta;
