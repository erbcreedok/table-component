import React, { FC, useRef } from 'react'
import TableCell from '@mui/material/TableCell'

import type { MultirowColumn, TableInstance } from '..'

import { TableHeadMultiRowCellActions } from './TableHeadMultiRowCellActions'

type Props = {
	cell: MultirowColumn
	cellStyles: Record<string, any>
	table: TableInstance
}

export const TableHeadMultiRowCell: FC<Props> = ({
	cell,
	cellStyles,
	table,
}) => {
	const localRef = useRef<HTMLTableCellElement>(null)

	return (
		<TableHeadMultiRowCellActions
			key={cell.id}
			anchorElRef={localRef}
			table={table}
			actions={cell.multirowColumnActions}
			cell={cell}
		>
			{({ onClick }) => (
				<TableCell
					onClick={onClick}
					ref={localRef}
					sx={{
						...cellStyles,
						...(cell.isPinned
							? {
									position: 'sticky',
									left: cell.leftPinnedPosition,
									right: cell.rightPinnedPosition,
									zIndex: 3,
							  }
							: {}),
						cursor: cell.multirowColumnActions ? 'pointer' : undefined,
					}}
					colSpan={cell.colSpan}
				>
					{cell.text}
				</TableCell>
			)}
		</TableHeadMultiRowCellActions>
	)
}
