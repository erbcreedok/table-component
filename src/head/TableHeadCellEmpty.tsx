import React, { FC } from 'react'
import TableCell from '@mui/material/TableCell'

import { Colors } from '../components/styles'

export interface Props {
	colSpan: number
}

export const TableHeadCellEmpty: FC<Props> = ({ colSpan }) => {
	return (
		<TableCell
			align="left"
			colSpan={colSpan}
			sx={() => ({
				boxSizing: 'border-box',
				cursor: undefined,
				fontWeight: 'bold',
				height: '48px',
				overflow: 'hidden',
				'&:hover, &:active': {
					overflow: 'visible',
					zIndex: 2,
				},
				p: '0',
				pb: '0.1rem',
				pt: '0.1rem',
				zIndex: 1,
				borderBottom: `1px solid ${Colors.Gray20}`,
				backgroundColor: Colors.Gray20,
			})}
		/>
	)
}
