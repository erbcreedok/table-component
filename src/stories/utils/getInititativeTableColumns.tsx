import { Avatar, Chip } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import React from 'react'
import { Initiative } from '../types/Initiative'

export const getInitiativeTableColumns = () => [
  {
    header: 'Unit',
    accessorKey: 'unit',
    Cell: ({ row }) => row.original.unitTitle
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
    Cell: ({ row: { original: row } }) => <Chip
      avatar={<Avatar alt={row.owner?.fullName} src={row.owner?.avatarUrl} />}
      label={row.owner?.fullName}
      variant="outlined"
    />,
},
] as MRT_ColumnDef<Initiative>[]
