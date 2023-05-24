import { Box, Typography } from '@mui/material'
import React, { FC } from 'react'

type DropdownContentHeaderProps = {
	headerTile: string
	onClearAll: () => void
}

export const DropdownContentHeader: FC<DropdownContentHeaderProps> = ({
	headerTile,
	onClearAll,
}) => {
	return (
		<Box
			component="div"
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				p: '15px 12px 6px',
				borderBottom: '1px solid #EBEDF5',
			}}
		>
			<Typography variant="body1" style={{ fontWeight: 600, fontSize: 12 }}>
				{headerTile}
			</Typography>

			<Typography
				variant="body2"
				onClick={onClearAll}
				style={{ color: '#009ECC', fontSize: 12, cursor: 'pointer' }}
			>
				Clear All
			</Typography>
		</Box>
	)
}
