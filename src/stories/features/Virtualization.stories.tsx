import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React, { useRef } from 'react'
import TableComponent, {
	Table_ColumnDef,
	TableBodyRow,
	TableComponentProps,
} from '../../'

const meta: Meta = {
	title: 'Features/Virtualization',
}

const CustomRow = (props) => <TableBodyRow {...props} />

export default meta

const longColumns: Table_ColumnDef<typeof longData[0]>[] = [
	{
		header: 'First Name',
		accessorKey: 'firstName',
	},
	{
		header: 'Middle Name',
		accessorKey: 'middleName',
	},
	{
		header: 'Last Name',
		accessorKey: 'lastName',
	},
	{
		header: 'Email Address',
		accessorKey: 'email',
		size: 300,
	},
	{
		header: 'Phone Number',
		accessorKey: 'phoneNumber',
	},
	{
		header: 'Address',
		accessorKey: 'address',
	},
	{
		header: 'Zip Code',
		accessorKey: 'zipCode',
	},
	{
		header: 'City',
		accessorKey: 'city',
	},
	{
		header: 'State',
		accessorKey: 'state',
	},
	{
		header: 'Country',
		accessorKey: 'country',
		size: 200,
	},
	{
		header: 'Favorite Color',
		accessorKey: 'favoriteColor',
	},
	{
		header: 'Favorite Quote',
		accessorKey: 'favoriteQuote',
	},
	{
		header: 'Pet Name',
		accessorKey: 'petName',
	},
	{
		header: 'Pet Type',
		accessorKey: 'petType',
	},
]

const longData = [...Array(500)].map(() => ({
	firstName: faker.name.firstName(),
	middleName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	phoneNumber: faker.phone.number(),
	address: faker.address.streetAddress(),
	zipCode: faker.address.zipCode(),
	city: faker.address.city(),
	state: faker.address.state(),
	country: faker.address.country(),
	favoriteQuote: faker.lorem.sentence(),
	favoriteColor: faker.internet.color(),
	petName: faker.animal.cat(),
	petType: faker.animal.type(),
}))

export const EnableRowVirtualization: Story<TableComponentProps> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
	/>
)

export const EnableRowVirtualizationWithWindowVirtualizer: Story<TableComponentProps> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
		windowVirtualizer={true}
		memoMode="rows"
	/>
)

export const EnableRowVirtualizationWithCustomScrollElement: Story<
	TableComponentProps
> = () => {
	const ref = useRef(null)

	return (
		<div style={{ width: 500, height: 300, overflow: 'auto' }} ref={ref}>
			<TableComponent
				columns={longColumns}
				data={longData}
				enablePagination={false}
				enableRowNumbers
				enableRowVirtualization
				enableBottomToolbar={false}
				rowVirtualizerProps={{
					getScrollElement: () => ref.current,
				}}
				memoMode="rows"
			/>
		</div>
	)
}

export const EnableRowVirtualizationWithCustomRow: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
		CustomRow={CustomRow}
		memoMode="rows"
	/>
)

export const EnableRowVirtualizationTallContent: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns.map((columnDef) => ({
			...columnDef,
			lineClamp: false,
			maxSize: 200,
		}))}
		data={longData}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
	/>
)

export const EnableRowVirtualizationWithColumnResizing: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enableColumnResizing
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
	/>
)

export const EnableRowVirtualizationWithDetailPanel: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData.slice(0, 100)}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
		renderDetailPanel={() => (
			<div style={{ height: '250px' }}>Detail Panel</div>
		)}
	/>
)

export const EnableRowVirtualizationWithMemoizedCells: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enableBottomToolbar={false}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		memoMode="cells"
	/>
)

export const EnableRowVirtualizationWithMemoizedRows: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enableBottomToolbar={false}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		memoMode="rows"
	/>
)

export const EnableRowVirtualizationStickyFooter: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={[
			{
				header: 'First Name',
				footer: 'First Name',
				accessorKey: 'firstName',
			},
			{
				header: 'Middle Name',
				footer: 'Middle Name',
				accessorKey: 'middleName',
			},
			{
				header: 'Last Name',
				footer: 'Last Name',
				accessorKey: 'lastName',
			},
		]}
		data={longData}
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
		enableBottomToolbar={false}
		enableStickyFooter
	/>
)

export const EnableColumnVirtualization: Story<TableComponentProps> = () => (
	<TableComponent
		columns={longColumns}
		data={longData.slice(0, 10)}
		enableRowNumbers
		enableColumnVirtualization
	/>
)

export const EnableColumnVirtualizationWithPinning: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData.slice(0, 10)}
		enableColumnVirtualization
		enablePinning
		enableRowNumbers
	/>
)

export const EnableColumnVirtualizationShortColumns: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns.slice(0, 3)}
		data={longData.slice(0, 10)}
		enableRowNumbers
		enableColumnVirtualization
	/>
)

export const EnableColumnVirtualizationWithFooter: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={[
			{
				header: 'First Name',
				footer: 'First Name',
				accessorKey: 'firstName',
			},
			{
				header: 'Middle Name',
				footer: 'Middle Name',
				accessorKey: 'middleName',
			},
			{
				header: 'Last Name',
				footer: 'Last Name',
				accessorKey: 'lastName',
			},
		]}
		data={longData.slice(0, 15)}
		enableRowNumbers
		enableColumnVirtualization
	/>
)

export const EnableColumnVirtualizationStickyFooter: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={[
			{
				header: 'First Name',
				footer: 'First Name',
				accessorKey: 'firstName',
			},
			{
				header: 'Middle Name',
				footer: 'Middle Name',
				accessorKey: 'middleName',
			},
			{
				header: 'Last Name',
				footer: 'Last Name',
				accessorKey: 'lastName',
			},
		]}
		data={longData.slice(0, 50)}
		enableRowNumbers
		enableColumnVirtualization
		enableStickyFooter
	/>
)

export const RowAndColumnVirtualization: Story<TableComponentProps> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enableBottomToolbar={false}
		enableColumnVirtualization
		enablePagination={false}
		enableRowNumbers
		enableRowVirtualization
	/>
)

export const RowAndColumnVirtualizationWithFeatures: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={longColumns}
		data={longData}
		enableBottomToolbar={false}
		enableColumnOrdering
		enableColumnResizing
		enableColumnVirtualization
		enablePagination={false}
		enablePinning
		enableRowNumbers
		enableRowSelection
		enableRowVirtualization
	/>
)

const fakeColumns = [...Array(500)].map((_, i) => {
	return {
		accessorKey: i.toString(),
		header: 'Column ' + i.toString(),
	}
})

const fakeData = [...Array(500)].map(() => ({
	...Object.fromEntries(
		fakeColumns.map((col) => [col.accessorKey, faker.name.firstName()])
	),
}))

export const MaxVirtualization: Story<TableComponentProps> = () => (
	<TableComponent
		columns={fakeColumns}
		data={fakeData}
		enableBottomToolbar={false}
		enableColumnVirtualization
		enablePagination={false}
		enablePinning
		enableRowNumbers
		enableRowVirtualization
		muiTableContainerProps={{ sx: { maxHeight: 500 } }}
		muiTablePaperProps={{ sx: { m: 'auto', maxWidth: 1000 } }}
	/>
)
