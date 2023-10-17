import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'

import { mergeSx } from '../utils/mergeSx'

import { Colors } from './styles'

export const TreeAngle = ({
	lastInList,
	sx,
	...rest
}: BoxProps & { lastInList?: boolean }) => {
	return (
		<Box
			sx={mergeSx(
				{
					height: '36px',
					display: 'flex',
					alignItems: lastInList ? 'flex-start' : 'center',
					marginRight: '10px',
				},
				sx
			)}
			{...rest}
		>
			{lastInList ? (
				<Box
					sx={{
						borderLeft: `1px solid ${Colors.Gray}`,
						borderBottom: `1px solid ${Colors.Gray}`,
						height: '50%',
						width: '13px',
						borderBottomLeftRadius: '3px',
					}}
				/>
			) : (
				<>
					<Box
						sx={{ borderLeft: `1px solid ${Colors.Gray}`, height: '100%' }}
					/>
					<Box
						sx={{ borderBottom: `1px solid ${Colors.Gray}`, width: '13px' }}
					/>
				</>
			)}
		</Box>
	)
}
