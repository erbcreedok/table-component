import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../..'
import { getRandomInt, getRandomItem } from '../utils/random'

const meta: Meta = {
	title: 'Features/Sticky Group Name',
}

export default meta

const colors = ['red', 'green', 'blue'] as const
const sizes = ['small', 'medium', 'large'] as const
const positions = ['top', 'bottom'] as const

interface MyRow {
	name: string
	color: typeof colors[number]
	size: typeof sizes[number]
	value: number
	position: typeof positions[number]
}

const data: MyRow[] = [...Array(50)].map((_, i) => ({
	name: String(i),
	color: getRandomItem(colors),
	size: getRandomItem(sizes),
	value: getRandomInt(1, 101),
	position: getRandomItem(positions),
}))

const columns: Table_ColumnDef<MyRow>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
	},
	{
		header: 'Color',
		accessorKey: 'color',
	},
	{
		header: 'Size',
		accessorKey: 'size',
	},
	{
		header: 'Value',
		accessorKey: 'value',
	},
	{
		header: 'Position',
		accessorKey: 'position',
	},
]

const commonProps: TableComponentProps<MyRow> = {
	columns,
	data,
	enableGrouping: true,
	muiTablePaperProps: {
		sx: {
			maxHeight: '800px',
		},
	},
}

export const Default: Story<TableComponentProps> = () => (
	<TableComponent {...commonProps} />
)

export const StickyHeader: Story<TableComponentProps> = () => (
	<TableComponent {...commonProps} enableStickyHeader />
)

export const StickyMultiHeader: Story<TableComponentProps> = () => (
	<TableComponent
		{...commonProps}
		enableStickyHeader
		multirowHeader={[
			{
				depth: 1,
				columns: [
					{
						text: 'One',
						columnIds: ['value', 'position'],
					},
				],
			},
		]}
	/>
)

export const StickyMultiHeaderSticky: Story<TableComponentProps> = () => (
	<TableComponent
		{...commonProps}
		enableStickyHeader
		multirowHeader={[
			{
				depth: 1,
				pin: true, // Sticky
				columns: [
					{
						text: 'One',
						columnIds: ['value', 'position'],
					},
				],
			},
		]}
	/>
)

export const StickyMultiHeaderSticky3: Story<TableComponentProps> = () => (
	<TableComponent
		{...commonProps}
		enableStickyHeader
		multirowHeader={[
			{
				depth: 1,
				pin: true, // Sticky
				columns: [
					{
						text: 'One',
						columnIds: ['value', 'position'],
					},
				],
			},
			{
				depth: 2,
				pin: true, // Sticky
				columns: [
					{
						text: 'Two',
						columnIds: ['value'],
					},
				],
			},
			{
				depth: 3,
				pin: true, // Sticky
				columns: [
					{
						text: 'Three',
						columnIds: ['position'],
					},
				],
			},
		]}
	/>
)

export const StickyMultiHeaderMixed4: Story<TableComponentProps> = () => (
	<TableComponent
		{...commonProps}
		enableStickyHeader
		multirowHeader={[
			{
				depth: 1,
				pin: false, // Sticky
				columns: [
					{
						text: 'One',
						columnIds: ['value', 'position'],
					},
				],
			},
			{
				depth: 2,
				pin: true, // Sticky
				columns: [
					{
						text: 'Two',
						columnIds: ['value'],
					},
				],
			},
			{
				depth: 3,
				pin: false, // Sticky
				columns: [
					{
						text: 'Three',
						columnIds: ['position'],
					},
				],
			},
			{
				depth: 4,
				pin: true, // Sticky
				columns: [
					{
						text: 'Four',
						columnIds: ['value', 'position'],
					},
				],
			},
		]}
	/>
)
