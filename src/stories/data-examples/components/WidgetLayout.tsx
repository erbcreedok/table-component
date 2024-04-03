import { Box, styled, Typography } from '@mui/material'
import React, { PropsWithChildren, RefObject } from 'react'

import { Colors } from '../../utils/constants'

const Title = styled(Typography)`
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 12px;
`

type Props = PropsWithChildren<{
	wrapperRef?: RefObject<HTMLDivElement | null>
}>
export const WidgetLayout = ({ children, wrapperRef }: Props) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '8px',
				background: Colors.white,
				height: '500px',
				border: `2px solid ${Colors.lightGrey}`,
				position: 'relative',
				resize: 'both',
				overflow: 'hidden',
			}}
		>
			<Title sx={{ mt: 2, mx: 3}}>Wrapper Block</Title>
			<Box
				ref={wrapperRef}
				sx={{
					mx: 3,
					mt: 2,
					boxSizing: 'border-box',
					maxWidth: '100%',
					height: '100%',
					background: Colors.bg,
					borderRadius: '4px',
					position: 'relative',
					overflow: 'auto',
				}}
			>
				<Box sx={{ mx: 3, mt: 2 }}>
					<Title>Embed window</Title>
					{children}
				</Box>
			</Box>
		</Box>
	)
}
