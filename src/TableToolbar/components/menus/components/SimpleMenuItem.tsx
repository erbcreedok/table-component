import React from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { Table_Column } from '../../../../'
import { ButtonLink } from '../../../../components/ButtonLink'

interface Props<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	isSorting?: boolean
	onAssendingClick?(column: Table_Column<TData>): void
	onDescendingClick?(column: Table_Column<TData>): void
}

export const SimpleMenuItem = <TData extends Record<string, any> = {}>({
	isSorting = false,
	column,
	onAssendingClick,
	onDescendingClick,
}: Props<TData>) => {
	const { columnDef } = column

	const handleAssendingClick = () => {
		if (typeof onAssendingClick === 'function') {
			onAssendingClick(column)
		}
	}

	const handleDescendingClick = () => {
		if (typeof onDescendingClick === 'function') {
			onDescendingClick(column)
		}
	}

	return (
		<MenuItem
			disableRipple
			sx={() => ({
				alignItems: 'center',
				justifyContent: 'flex-start',
				height: 48,
				padding: '0 15px',
				margin: '0 9px',
				'&:hover': {
					backgroundColor: '#F5F6FA',
					borderRadius: '6px',
				},
				'&:hover div div': {
					display: 'flex',
				},
			})}
		>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					paddingLeft: '4px',
					alignItems: 'center',
					minWidth: '100%',
					'& div': {
						display: 'none',
						marginLeft: 'auto',
						paddingRight: '5px',
					},
				}}
			>
				<Typography sx={{ alignSelf: 'center' }}>{columnDef.header}</Typography>
				<Box>
					{isSorting ? (
						<>
							<ButtonLink
								style={{ marginRight: '18px' }}
								onClick={handleAssendingClick}
							>
								Assending +
							</ButtonLink>
							<ButtonLink onClick={handleDescendingClick}>
								Descending +
							</ButtonLink>
						</>
					) : (
						<ButtonLink onClick={column.getToggleGroupingHandler()}>
							Add Item +
						</ButtonLink>
					)}
				</Box>
			</Box>
		</MenuItem>
	)
}
