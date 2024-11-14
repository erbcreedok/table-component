import { Avatar, Chip } from '@mui/material'
import React from 'react'
import { Table_ColumnDef } from '../../'
import { Initiative } from '../types/Initiative'

export const getInitiativeTableColumns = () =>
	[
		{
			header: 'Unit',
			accessorKey: 'unit',
		},
		{
			header: 'Title',
			accessorKey: 'title',
		},
		{
			header: 'Progress',
			accessorKey: 'progress',
			AggregatedCell: () => (
				<div style={{ display: 'flex', width: '83px', height: '20px' }}>
					<div style={{ backgroundColor: 'red', flexGrow: 1 }} />
					<div style={{ backgroundColor: 'green', flexGrow: 1 }} />
					<div style={{ backgroundColor: 'yellow', flexGrow: 1 }} />
					<div style={{ backgroundColor: 'gray', flexGrow: 1 }} />
				</div>
			),
		},
		{
			header: 'Status',
			accessorKey: 'status',
		},
		{
			header: 'Owner',
			accessorKey: 'owner.fullName',
			Cell: ({ row: { original: row } }) => (
				<Chip
					avatar={
						<Avatar alt={row.owner?.fullName} src={row.owner?.avatarUrl} />
					}
					label={row.owner?.fullName}
					variant="outlined"
				/>
			),
		},
	].map((i) => ({
		...i,
		Header: ({ column }) => column.columnDef.header?.toUpperCase(),
	})) as Table_ColumnDef<Initiative>[]
