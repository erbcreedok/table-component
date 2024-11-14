import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const columns: Table_ColumnDef<typeof data[0]>[] = [
	{
		header: 'Name',
		id: 'name',
		columns: [
			{
				header: 'First Name',
				accessorKey: 'firstName',
			},

			{
				header: 'Last Name',
				accessorKey: 'lastName',
			},
		],
	},
	{
		header: 'Info',
		id: 'info',
		columns: [
			{
				header: 'Age',
				accessorKey: 'age',
			},
			{
				header: 'Address',
				accessorKey: 'address',
			},
		],
	},
]

const data = [...Array(55)].map(() => ({
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	age: faker.datatype.number(80),
	address: faker.address.streetAddress(),
	city: faker.address.city(),
	state: faker.address.state(),
}))

export const HeaderGroups: Story<TableComponentProps> = (args) => (
	<TableComponent {...(args as any)} columns={columns} data={data} />
)

export const HeaderGroupsPagination: Story<TableComponentProps> = (args) => (
	<TableComponent
		{...(args as any)}
		columns={columns}
		data={data}
		initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
	/>
)

export const HeaderAndFooterGroups: Story<TableComponentProps> = (args) => (
	<TableComponent
		{...args}
		columns={[
			{
				header: 'Name',
				id: 'name',
				footer: 'Name',
				columns: [
					{
						header: 'First Name',
						footer: 'First Name',
						accessorKey: 'firstName',
					},
					{
						header: 'Last Name',
						footer: 'Last Name',
						accessorKey: 'lastName',
					},
				],
			},
			{
				header: 'Info',
				id: 'info',
				footer: 'Info',
				columns: [
					{
						header: 'Age',
						footer: 'Age',
						accessorKey: 'age',
					},
					{
						header: 'Address',
						footer: 'Address',
						accessorKey: 'address',
					},
				],
			},
		]}
		data={data}
	/>
)

export const MixedHeaderGroups: Story<TableComponentProps> = (args) => {
	return (
		<TableComponent
			{...args}
			columns={[
				{
					accessorKey: 'firstName',
					header: 'First Name',
				},
				{
					accessorKey: 'lastName',
					header: 'Last Name',
				},
				{
					id: 'grouped',
					header: 'Grouped',
					columns: [
						{
							accessorKey: 'address',
							header: 'Address',
						},
					],
				},
				{
					accessorKey: 'city',
					header: 'City',
				},
				{
					accessorKey: 'state',
					header: 'State',
				},
			]}
			data={data}
		/>
	)
}

export const DeepMixedHeaderGroups: Story<TableComponentProps> = (args) => {
	return (
		<TableComponent
			{...args}
			columns={[
				{
					accessorKey: 'firstName',
					header: 'First Name',
				},
				{
					id: 'grouped',
					header: 'Grouped',
					columns: [
						{
							header: 'Location',
							id: 'location',
							columns: [
								{
									accessorKey: 'address',
									header: 'Address',
								},
								{
									accessorKey: 'city',
									header: 'City',
								},
								{
									accessorKey: 'state',
									header: 'State',
								},
							],
						},
					],
				},
				{
					accessorKey: 'lastName',
					header: 'Last Name',
				},
			]}
			data={data}
		/>
	)
}

const meta: Meta = {
	title: 'Features/Header Groups Examples',
	argTypes: {
		enableStickyHeader: {
			control: 'boolean',
		},
		enableColumnOrdering: {
			control: 'boolean',
		},
		enablePinning: {
			control: 'boolean',
		},
		enableColumnResizing: {
			control: 'boolean',
		},
		enableHeaderGroupRowSpan: {
			control: 'boolean',
		},
	},
}

export default meta
