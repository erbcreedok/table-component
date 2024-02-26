import React, { FC } from 'react'
import TableCell from '@mui/material/TableCell'

import type { MultirowColumn } from '..'

type Props = {
	cell: MultirowColumn
	cellStyles: Record<string, any>
}

export const TableHeadMultiRowCellEmpty: FC<Props> = ({ cell, cellStyles }) => {
	if (cell.colSpan === 0) {
		return null
	}

	return (
		<TableCell
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
			}}
			colSpan={cell.colSpan}
		/>
	)
}
