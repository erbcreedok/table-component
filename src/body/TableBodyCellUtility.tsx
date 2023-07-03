import React, { FC, RefObject } from 'react'
import Box from '@mui/material/Box'

import { Table_Cell, TableInstance } from '..'
import { Text } from '../components/styles'

import { TableBodyRowGrabHandle } from './TableBodyRowGrabHandle'

interface Props {
	cell: Table_Cell
	table: TableInstance
	rowRef: RefObject<HTMLTableRowElement>
	rowIndex: number
	isDraggableCell?: boolean
	isCurrentRowSelected?: boolean
	enableRowNumbers?: boolean
}

export const TableBodyCellUtility: FC<Props> = ({
	cell,
	table,
	isDraggableCell,
	isCurrentRowSelected,
	rowRef,
	rowIndex,
	enableRowNumbers,
}) => {
	const {
		options: {
			hideRowSelectionColumn,
			enableRowSelection,
			enableSelectAll,
			enableMultiRowSelection,
		},
	} = table
	const { column, row } = cell
	const { columnDef } = column

	const isRowNumbersOnly =
		hideRowSelectionColumn ||
		!enableRowSelection ||
		!enableSelectAll ||
		!enableMultiRowSelection

	return (
		<>
			{enableRowNumbers && (
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						color: Text.Disabled,
						fontSize: '12px',
						fontWeight: 600,
						lineHeight: '18px',
						visibility: !isCurrentRowSelected ? 'visible' : 'hidden',
						'tr:hover &': {
							visibility: isRowNumbersOnly ? 'visible' : 'hidden',
						},
					}}
				>
					{rowIndex + 1}
				</Box>
			)}
			{isDraggableCell ? (
				<TableBodyRowGrabHandle
					cell={cell}
					rowRef={rowRef}
					table={table}
					sx={{
						visibility: isCurrentRowSelected ? 'visible' : 'hidden',
						'tr:hover &': {
							visibility: 'visible',
						},
					}}
				/>
			) : (
				<Box sx={{ width: '9px' }} />
			)}
			{columnDef.Cell?.({ cell, column, row, table })}
		</>
	)
}
