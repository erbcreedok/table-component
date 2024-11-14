import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import TableComponent, {
	Table_Column,
	Table_ColumnDef,
	TableComponentProps,
} from '../../'
import { Initiative } from '../types/Initiative'
import { generateInitiatives } from '../utils/generateInitiatives'
import { getInitiativeTableColumns } from '../utils/getInititativeTableColumns'

const meta: Meta = {
	title: 'Features/Column Grouping Examples',
}

export default meta

const columns = getInitiativeTableColumns()

const data = generateInitiatives(60)

export const ColumnGroupingEnabled: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		enableGrouping
		enableAggregationRow
	/>
)

export const SuggestedGrouping: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		enableGrouping
		enableAggregationRow
		suggestedColumns={{ grouping: ['unit', 'status'] }}
	/>
)

export const ColumnGroupingNoDragHandles: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		enableGrouping
		enableAggregationRow
		enableColumnDragging={false}
	/>
)

export const ColumnGroupingEnabledDropZoneBottom: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={columns}
		data={data}
		enableGrouping
		enableAggregationRow
		positionToolbarDropZone="bottom"
	/>
)

export const ColumnGroupingEnabledCustomAggregate: Story<
	TableComponentProps
> = () => (
	<TableComponent
		columns={getInitiativeTableColumns()}
		data={data}
		enableGrouping
	/>
)

export const ColumnGroupingBannerOnBottom: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		enableGrouping
		positionToolbarAlertBanner="bottom"
	/>
)

export const GroupingColumnsSetState: Story<TableComponentProps> = () => {
	const [columns, setColumns] = useState<Table_ColumnDef<any>[]>([])
	const [data, setData] = useState<any>([])

	useEffect(() => {
		// Do something and set columns and data

		setColumns([
			{
				accessorKey: 'name.firstName', //access nested data with dot notation
				header: 'First Name',
			},
			{
				accessorKey: 'name.lastName',
				header: 'Last Name',
			},
			{
				accessorKey: 'address', //normal accessorKey
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
		])

		setData([
			{
				name: {
					firstName: 'John',
					lastName: 'Doe',
				},
				address: '261 Erdman Ford',
				city: 'East Daphne',
				state: 'Kentucky',
			},
			{
				name: {
					firstName: 'Jane',
					lastName: 'Doe',
				},
				address: '769 Dominic Grove',
				city: 'Columbus',
				state: 'Ohio',
			},
			{
				name: {
					firstName: 'Joe',
					lastName: 'Doe',
				},
				address: '566 Brakus Inlet',
				city: 'South Linda',
				state: 'West Virginia',
			},
			{
				name: {
					firstName: 'Kevin',
					lastName: 'Vandy',
				},
				address: '722 Emie Stream',
				city: 'Lincoln',
				state: 'Nebraska',
			},
			{
				name: {
					firstName: 'Joshua',
					lastName: 'Rolluffs',
				},
				address: '32188 Larkin Turnpike',
				city: 'Charleston',
				state: 'South Carolina',
			},
		])
	}, [])

	return (
		<TableComponent
			columns={columns}
			data={data}
			enableGrouping
			state={{ columnOrder: columns.map((c) => c.accessorKey as string) }}
		/>
	)
}

export const ColumnGroupingDropZoneAlwaysVisible: Story<
	TableComponentProps
> = () => {
	const [draggingColumn, setDraggingColumn] =
		useState<Table_Column<Initiative> | null>(null)

	return (
		<TableComponent
			columns={columns}
			data={data}
			enableGrouping
			localization={
				!draggingColumn
					? { dropToGroupBy: 'Drag a column here to group by it' }
					: undefined
			}
			muiTopToolbarProps={{
				sx: {
					'& .Mui-ToolbarDropZone': {
						border: '1px solid red',
					},
				},
			}}
			onDraggingColumnChange={setDraggingColumn}
			positionToolbarAlertBanner="bottom"
			state={{ draggingColumn, showToolbarDropZone: true }}
		/>
	)
}
