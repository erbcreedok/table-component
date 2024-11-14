import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Styling/Table Dimensions Examples',
}

export default meta

const columns: Table_ColumnDef<typeof data[0]>[] = [
	{
		header: 'First Name',
		accessorKey: 'firstName',
	},
	{
		header: 'Last Name',
		accessorKey: 'lastName',
	},
	{
		header: 'Address',
		accessorKey: 'address',
	},
	{
		header: 'State',
		accessorKey: 'state',
	},
	{
		header: 'Phone Number',
		accessorKey: 'phoneNumber',
	},
]

const data = [...Array(100)].map(() => ({
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	address: faker.address.streetAddress(),
	state: faker.address.state(),
	phoneNumber: faker.phone.number(),
}))

export const MaxWidthAndCentered: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		muiTablePaperProps={{
			sx: {
				maxWidth: '800px',
				m: 'auto',
			},
		}}
	/>
)

export const maxHeight: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		muiTableContainerProps={{
			sx: {
				maxHeight: '500px',
			},
		}}
	/>
)

export const minHeight: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data.slice(0, 5)}
		muiTableContainerProps={{
			sx: {
				minHeight: '800px',
			},
		}}
	/>
)

export const minHeightParent: Story<TableComponentProps> = () => (
	<div style={{ height: '700px' }}>
		<TableComponent
			columns={columns}
			data={data.slice(0, 5)}
			muiTableContainerProps={({ table }) => ({
				sx: {
					height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
				},
			})}
			muiTablePaperProps={{
				sx: {
					height: '100%',
				},
			}}
		/>
	</div>
)

export const DragScrollingGrabResizeOrder: Story<TableComponentProps> = () => {
	// const ref = useRef(null)
	return (
		// <div
		// 	ref={ref}
		// 	style={{
		// 		width: '700px',
		// 		height: '600px',
		// 		overflow: 'auto',
		// 		position: 'relative',
		// 	}}
		// >
		<TableComponent
			columns={columns}
			data={data}
			muiTablePaperProps={{
				sx: {
					maxWidth: '700px',
					maxHeight: '1200px',
					m: '70em auto',
				},
			}}
			enableStickyScrollbars={{
				horizontal: true,
				// parent: ref.current
			}}
			enableDragScrolling
			enableRowDragging
			enableColumnResizing
			enableColumnOrdering
		/>
		// </div>
	)
}
